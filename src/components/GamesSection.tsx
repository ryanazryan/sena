/// <reference types="vite/client" />
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  Gamepad2, Upload, CheckCircle,
  AlertCircle, Brain, Eye, Send, Plus, Edit,
  Trophy, Target, PlayCircle, Loader2, FileImage,
  Check, X, Calendar,
  BookOpen,
  Award
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { db } from "../lib/firebase";
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  addDoc, orderBy, Timestamp
} from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { Label } from "./ui/label";
import { UserProfile } from "../lib/auth";
import { TeacherGamesView } from "./TeacherGamesView";

interface GamesSectionProps {
  userRole?: 'student' | 'teacher' | null;
  user: FirebaseUser | null;
}

export type ScoreEntry = {
  id: string;
  userId: string;
  studentName?: string;
  game: string;
  score: number;
  maxScore: number;
  note?: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'graded';
  feedback?: string;
  teacherNote?: string;
  createdAt: Timestamp;
  rank?: string;
};

type ManagedGame = {
  id: string;
  name: string;
  link: string;
  deadline: Timestamp;
  stage: number;
};

interface StudentGamesViewProps {
  user: FirebaseUser | null;
  games: ManagedGame[];
  isLoadingGames: boolean;
}

const StudentGamesView = ({ user, games, isLoadingGames }: StudentGamesViewProps) => {
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    const submissionsCol = collection(db, "gameSubmissions");
    const q = query(submissionsCol, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ScoreEntry));
      setSubmissions(submissionsData);
    });
    return () => unsubscribe();
  }, [user]);

  const highestApprovedScores = useMemo(() => {
    const scoreMap = new Map<string, number>();
    submissions
      .filter(sub => sub.status === 'graded' || sub.status === 'approved')
      .forEach(sub => {
        const existingScore = scoreMap.get(sub.game) || 0;
        if (sub.score > existingScore) {
          scoreMap.set(sub.game, sub.score);
        }
      });
    return scoreMap;
  }, [submissions]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Daftar Game Tersedia</h2>
      {isLoadingGames ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : games.length > 0 ? (
        <div className="space-y-4">
          {games.map((game, index) => {
            let isLocked = false;
            if (index > 0) {
              const prevGameName = games[index - 1]?.name;
              const highestPrevScore = highestApprovedScores.get(prevGameName) || 0;
              if (highestPrevScore < 7) {
                isLocked = true;
              }
            }
            return (
              <Card
                key={game.id}
                className={`transition-all hover:shadow-md transition-shadow ${isLocked ? 'border-gray-300 bg-gray-100' : 'border-2 border-green-600 bg-green-50/30'}`}
              >
                <CardContent className={`p-4 flex items-center justify-between hover: ${isLocked ? 'opacity-50' : ''}`}>
                  <div className="space-y-1">
                    <p className={`flex items-center font-semibold text-base ${isLocked ? 'text-gray-500' : 'text-green-800'}`}>
                      {`Game ${game.name}`}
                    </p>
                    {`Level ${game.stage}`}
                    <p>  </p>
                    <p className="text-sm text-muted-foreground ml-7">
                      Tenggat: {game.deadline.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Button
                    onClick={() => !isLocked && window.open(game.link, '_blank')}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <><X className="w-4 h-4 mr-2" /> Terkunci</>
                    ) : (
                      <><PlayCircle className="w-4 h-4 mr-2" /> {`Mulai Level ${game.stage}`}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">Belum ada game yang ditugaskan oleh guru.</p>
      )}
    </>
  );
};

interface SubmitScoreFormProps {
  user: FirebaseUser | null;
  setShowSubmitForm: (show: boolean) => void;
  availableGames: ManagedGame[];
}

const SubmitScoreForm = ({ user, setShowSubmitForm, availableGames }: SubmitScoreFormProps) => {
  const [game, setGame] = useState("");
  const [score, setScore] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (availableGames.length > 0 && !game) {
      setGame(availableGames[0].name);
    }
  }, [availableGames, game]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !game || !file || !user) {
      setError("Game, Skor, dan Screenshot wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal mengunggah gambar.");
      const data = await res.json();

      await addDoc(collection(db, "gameSubmissions"), {
        game,
        score: parseInt(score),
        maxScore: 10,
        screenshotUrl: data.secure_url,
        userId: user.uid,
        studentName: user.displayName || user.email,
        status: "pending",
        createdAt: Timestamp.now()
      });

      setSuccessMessage("Kiriman Anda berhasil disimpan dan sedang diproses oleh AI.");
      setTimeout(() => setShowSubmitForm(false), 4000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <Card className="border-green-500">
        <CardHeader><CardTitle className="text-green-700 flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Berhasil!</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm italic">{successMessage}</p>
          <Button variant="outline" onClick={() => setShowSubmitForm(false)} className="mt-4">Tutup</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center text-lg font-medium mb-2">Submit Nilai Game</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-2">
              <Label htmlFor="game-select">Pilih Level</Label>
              <select id="game-select" className="w-full p-2 border rounded-lg bg-input mt-2" value={game} onChange={(e) => setGame(e.target.value)}>
                {availableGames.map((g) => (
                  <option key={g.id} value={g.name}>{`Level ${g.stage}: ${g.name}`}</option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <Label htmlFor="score-input">Skor Anda (1-10)</Label>
              <Input id="score-input" placeholder="1-10" type="number" max="10" min="1" value={score} onChange={(e) => setScore(e.target.value)} required className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="file-upload">Upload Screenshot Skor (Wajib)</Label>
            <div className="mt-2">
              {previewUrl ? (
                <div className="relative border rounded-lg overflow-hidden aspect-video">
                  <img src={previewUrl} alt="Preview screenshot" className="w-full h-full object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => {
                      setPreviewUrl(null);
                      setFile(null);
                      (document.getElementById('file-upload') as HTMLInputElement).value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Klik untuk upload</p>
                </label>
              )}
            </div>
            <input id="file-upload" type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileChange} required />
          </div>
          {error && (<div className="text-sm text-destructive flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>)}
          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Mensubmit..." : "Submit Nilai"}
            </Button>
            <Button variant="outline" type="button" onClick={() => setShowSubmitForm(false)} disabled={isSubmitting}>Batal</Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
};

export function GamesSection({ userRole, user }: GamesSectionProps) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [reviewingSubmission, setReviewingSubmission] = useState<ScoreEntry | null>(null);
  const [teacherScore, setTeacherScore] = useState(0);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [managedGames, setManagedGames] = useState<ManagedGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    const gamesQuery = query(collection(db, "managedGames"), orderBy("stage", "asc"));
    const unsubscribe = onSnapshot(gamesQuery, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setManagedGames(gamesData);
      setIsLoadingGames(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    setIsLoadingData(true);
    const submissionsCol = collection(db, "gameSubmissions");
    const q = userRole === 'teacher'
      ? query(submissionsCol, orderBy("createdAt", "desc"))
      : query(submissionsCol, where("userId", "==", user.uid), orderBy("createdAt", "desc"));

    const unsubscribeSubmissions = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScoreEntry));
      setSubmissions(data);
      setIsLoadingData(false);
    });

    let unsubscribeUsers = () => { };
    if (userRole === 'teacher') {
      const usersQuery = query(collection(db, "users"));
      unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
        setAllUsers(usersData);
      });
    }

    return () => {
      unsubscribeSubmissions();
      unsubscribeUsers();
    };
  }, [user, userRole]);

  const gameToStageMap = useMemo(() => new Map(managedGames.map(g => [g.name, g.stage])), [managedGames]);
  const userInfoMap = useMemo(() => new Map(allUsers.map(u => [u.uid, { name: u.namaLengkap, email: u.email }])), [allUsers]);

  const getStatusBadge = (status: ScoreEntry['status']) => {
    switch (status) {
      case 'pending': return <Badge className="text-orange-600 bg-orange-50"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu AI</Badge>;
      case 'approved': return <Badge className="text-blue-600 bg-blue-50"><Check className="w-3 h-3 mr-1" /> Disetujui Guru</Badge>;
      case 'rejected': return <Badge className="text-red-600 bg-red-50"><X className="w-3 h-3 mr-1" /> Ditolak Guru</Badge>;
      case 'graded': return <Badge className="text-green-600 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" /> Telah Dinilai</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };



  const openReviewModal = (submission: ScoreEntry) => {
    setTeacherFeedback(submission.teacherNote || submission.feedback || "");
    setTeacherScore(submission.score);
    setApprovalError(null);
    setReviewingSubmission(submission);
  };

  const handleApproveWithAI = async () => {
    if (!reviewingSubmission) return;
    setIsApproving(true);
    setApprovalError(null);
    try {
      const res = await fetch('http://localhost:3001/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: teacherScore,
          note: reviewingSubmission.note || "Tidak ada catatan dari siswa.",
          game: reviewingSubmission.game,
          teacherNote: teacherFeedback
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mendapatkan feedback dari AI.");

      const docRef = doc(db, "gameSubmissions", reviewingSubmission.id);
      await updateDoc(docRef, {
        status: "graded",
        feedback: data.feedback,
        teacherNote: teacherFeedback,
        score: teacherScore,
        rank: teacherScore >= 9 ? 'A+' : (teacherScore >= 7 ? 'A' : 'B+')
      });
      setReviewingSubmission(null);
    } catch (err: any) {
      setApprovalError(err.message || "Pastikan server AI (localhost:3001) berjalan.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!reviewingSubmission || !teacherFeedback.trim()) {
      setApprovalError("Catatan feedback wajib diisi untuk menolak kiriman.");
      return;
    }
    setIsApproving(true);
    setApprovalError(null);
    try {
      const docRef = doc(db, "gameSubmissions", reviewingSubmission.id);
      await updateDoc(docRef, {
        status: "rejected",
        feedback: teacherFeedback,
        teacherNote: teacherFeedback
      });
      setReviewingSubmission(null);
    } catch (err: any) {
      setApprovalError("Gagal menolak kiriman.");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs defaultValue="games" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="games">{userRole === 'teacher' ? 'Kelola Games' : 'Main Game'}</TabsTrigger>
          <TabsTrigger value="submit">{userRole === 'teacher' ? 'Review Siswa' : 'Submit Nilai'}</TabsTrigger>
        </TabsList>

        <TabsContent value="games" className="mt-6">
          {userRole === 'teacher' ? <TeacherGamesView /> : <StudentGamesView user={user} games={managedGames} isLoadingGames={isLoadingGames} />}
        </TabsContent>

        <TabsContent value="submit" className="mt-6">
          {userRole === 'student' && showSubmitForm && (
            <div className="mb-6">
              <SubmitScoreForm user={user} setShowSubmitForm={setShowSubmitForm} availableGames={managedGames} />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {userRole === 'teacher' ? 'Daftar Kiriman Skor' : 'Riwayat Nilai Saya'}
              </h2>
              {userRole === 'student' && !showSubmitForm && (
                <Button onClick={() => setShowSubmitForm(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Submit Nilai Baru
                </Button>
              )}
            </div>
            {isLoadingData ? (
              <div className="flex justify-center h-40 items-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">{userRole === 'teacher' ? 'Belum Ada Kiriman' : 'Anda Belum Submit Nilai'}</h3>
              </div>
            ) : (
              <div className="grid gap-4">
                {/* --- KODE BARU DITEMPATKAN DI SINI --- */}
                {submissions.map(sub => {
                  const displayName = userInfoMap.get(sub.userId)?.name || sub.studentName || 'Siswa';
                  return (
                    <Card key={sub.id} className={`hover:shadow-md transition-shadow ${sub.status === 'pending' ? 'border-orange-200' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="flex items-center"><Trophy className="w-5 h-5 mr-2" /> {sub.game}</CardTitle>
                            <CardDescription className="mt-2">
                              {userRole === 'teacher' ? `Siswa: ${displayName}` : `Dimainkan pada ${sub.createdAt.toDate().toLocaleDateString('id-ID')}`}
                            </CardDescription>
                          </div>
                          {getStatusBadge(sub.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          {userRole === 'teacher' ? (
                            <Button className="flex-1" onClick={() => openReviewModal(sub)} variant={sub.status === 'pending' ? 'default' : 'secondary'}>
                              {sub.status === 'pending' && <><FileImage className="w-4 h-4 mr-2" /> Review Kiriman</>}
                              {sub.status !== 'pending' && <><Edit className="w-4 h-4 mr-2" /> Lihat/Edit Feedback</>}
                            </Button>
                          ) : (
                            <Button variant="outline" className="flex-1" onClick={() => openReviewModal(sub)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Lihat Detail Kiriman
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!reviewingSubmission} onOpenChange={(open) => !open && setReviewingSubmission(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] grid grid-rows-[auto_1fr_auto] p-0">
          {reviewingSubmission && (
            <>
              <DialogHeader className="p-6 border-b">
                <DialogTitle className="font-bold text-xl">Game {reviewingSubmission.game}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                  <span className="mr-2 font-medium">
                    {userInfoMap.get(reviewingSubmission.userId)?.name || reviewingSubmission.studentName}
                  </span>
                  <span className="mr-2">
                    {userInfoMap.get(reviewingSubmission.userId)?.email || 'N/A'}
                  </span>
                  <span className="mr-2">
                    Level: {gameToStageMap.get(reviewingSubmission.game) || 'N/A'}
                  </span>
                  <span className="mr-2">
                    Skor Diajukan: {reviewingSubmission.score}
                  </span>
                  {getStatusBadge(reviewingSubmission.status)}
                </DialogDescription>

              </DialogHeader>
              <div className="overflow-y-auto p-6 grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Bukti Screenshot</h4>
                  <div className="border rounded-lg overflow-hidden aspect-video">
                    <ImageWithFallback src={reviewingSubmission.screenshotUrl} alt="Screenshot" className="w-full h-full object-contain" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Verifikasi & Feedback Guru</h4>
                  <div className="space-y-2">
                    <Label><Award className="w-4 h-4 text-primary mr-1" />Skor Final (1-10)</Label>
                    <Input type="number" value={teacherScore} onChange={(e) => setTeacherScore(parseInt(e.target.value))} max={10} min={1} disabled={userRole !== 'teacher'} />
                  </div>
                  <div className="space-y-2">
                    <Label><BookOpen className="w-4 h-4 text-primary mr-1" />Catatan Guru </Label>
                    <Textarea placeholder="Tuliskan catatan tambahan Anda..." className="min-h-[120px]" value={teacherFeedback} onChange={(e) => setTeacherFeedback(e.target.value)} disabled={userRole !== 'teacher'} />
                  </div>
                  {reviewingSubmission.status === 'graded' && reviewingSubmission.feedback && (
                    <div className="space-y-2">
                      <Label className="flex items-center"><Brain className="w-4 h-4 mr-2 text-primary" /> Feedback AI</Label>
                      <div className="p-3 bg-muted rounded-lg border max-h-[150px] overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">{reviewingSubmission.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {userRole === 'teacher' && (
                <DialogFooter className="p-6 border-t">
                  {approvalError && <p className="text-sm text-destructive text-left w-full mb-2">{approvalError}</p>}
                  <Button variant="destructive" onClick={handleReject} disabled={isApproving}>
                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4 mr-2" />} Tolak
                  </Button>
                  <Button onClick={handleApproveWithAI} className="bg-green-600 hover:bg-green-700" disabled={isApproving}>
                    {isApproving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    Setujui & Hasilkan Feedback AI
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}