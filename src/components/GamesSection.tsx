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
  AlertCircle, Brain, Eye, Plus,
  Trophy, PlayCircle, Loader2,
  Check, X,
  BookOpen,
  Award,
  Mail
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  level: number;
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
  level: number;
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
    submissions.filter(sub => sub.status === 'graded' || sub.status === 'approved').forEach(sub => {
      const uniqueKey = `${sub.game}-L${sub.level}`;
      const existingScore = scoreMap.get(uniqueKey) || 0;
      if (sub.score > existingScore) {
        scoreMap.set(uniqueKey, sub.score);
      }
    });
    return scoreMap;
  }, [submissions]);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Daftar Game Tersedia</h2>
      {isLoadingGames ? (
        <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : games.length > 0 ? (
        <div className="space-y-4">
          {games.map((game) => {
            const displayLevel = !isNaN(game.level) ? game.level : 'N/A';
            let isLocked = false;

            if (game.level > 1) {
              const PASSING_SCORE = 7;
              const prevLevelGames = games.filter(g => g.level === game.level - 1);

              if (prevLevelGames.length === 0) {
                isLocked = true;
              } else {
                const allPrevGamesPassed = prevLevelGames.every(prevGame => {
                  const uniqueKey = `${prevGame.name}-L${prevGame.level}`;
                  return (highestApprovedScores.get(uniqueKey) || 0) >= PASSING_SCORE;
                });

                if (!allPrevGamesPassed) {
                  isLocked = true;
                }
              }
            }

            return (
              <Card key={game.id} className={`transition-all hover:shadow-md ${isLocked ? 'border-gray-300 bg-gray-100' : 'border-2 border-green-600 bg-green-50/30'}`}>
                <CardContent className={`p-4 flex items-center justify-between ${isLocked ? 'opacity-50' : ''}`}>
                  <div className="space-y-1">
                    <p className={`font-semibold text-base ${isLocked ? 'text-gray-500' : 'text-green-800'}`}>{game.name}</p>
                    <p className="text-sm text-muted-foreground">Level {displayLevel}</p>
                    {game.deadline && (
                      <p className="text-sm text-muted-foreground">
                        Tenggat: {game.deadline.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <Button onClick={() => !isLocked && window.open(game.link, '_blank')} disabled={isLocked}>
                    {isLocked ? (<><X className="w-4 h-4 mr-2" /> Terkunci</>) : (<><PlayCircle className="w-4 h-4 mr-2" /> Mulai Level {displayLevel}</>)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (<p className="text-center text-muted-foreground py-10">Belum ada game yang ditugaskan.</p>)}
    </>
  );
};

interface SubmitScoreFormProps {
  user: FirebaseUser | null;
  setShowSubmitForm: (show: boolean) => void;
  availableGames: ManagedGame[];
}

// --- PERBAIKAN TYPO DI SINI ---
const SubmitScoreForm = ({ user, setShowSubmitForm, availableGames }: SubmitScoreFormProps) => {
// --- AKHIR PERBAIKAN ---
  const [selectedGameId, setSelectedGameId] = useState(() => availableGames && availableGames.length > 0 ? availableGames[0].id : "");
  const [score, setScore] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (availableGames && availableGames.length > 0) {
      const currentSelectionStillExists = availableGames.some(g => g.id === selectedGameId);
      if (!selectedGameId || !currentSelectionStillExists) {
        setSelectedGameId(availableGames[0].id);
      }
    }
  }, [availableGames, selectedGameId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGame = availableGames.find(g => g.id === selectedGameId);
    if (!score || !selectedGame || !file || !user) {
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
        method: "POST", body: formData,
      });
      if (!res.ok) throw new Error("Gagal mengunggah gambar.");
      const data = await res.json();
      await addDoc(collection(db, "gameSubmissions"), {
        game: selectedGame.name,
        level: selectedGame.level,
        score: parseInt(score),
        maxScore: 10,
        note,
        screenshotUrl: data.secure_url,
        userId: user.uid,
        studentName: user.displayName || user.email,
        status: "pending",
        createdAt: Timestamp.now()
      });
      setSuccessMessage("Kiriman Anda berhasil disimpan.");
      setTimeout(() => setShowSubmitForm(false), 3000);
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
          <CardTitle className="flex items-center text-lg font-medium">Submit Nilai Game</CardTitle>
          <CardDescription>Pilih game yang sudah Anda selesaikan dan upload buktinya.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select value={selectedGameId} onValueChange={setSelectedGameId}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Pilih game atau level..." />
                </SelectTrigger>
                <SelectContent>
                  {availableGames.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {`Level ${g.level}: ${g.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="score-input">Skor Anda (1-10)</Label>
              <Input id="score-input" placeholder="Contoh: 8" type="number" max="10" min="1" value={score} onChange={(e) => setScore(e.target.value)} required className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="note-input">Catatan Pengalaman (Opsional)</Label>
            <Textarea id="note-input" placeholder="Ceritakan pengalamanmu saat bermain game ini..." value={note} onChange={(e) => setNote(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="file-upload">Upload Screenshot Skor (Wajib)</Label>
            <div className="mt-1">
              {previewUrl ? (
                <div className="relative border rounded-lg overflow-hidden aspect-video">
                  <img src={previewUrl} alt="Preview screenshot" className="w-full h-full object-cover" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => {
                      setPreviewUrl(null); setFile(null);
                      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Klik atau seret file ke sini</p>
                </label>
              )}
            </div>
            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} required />
          </div>
          {error && (<div className="text-sm text-destructive flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>)}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Mengirim..." : "Kirim Nilai"}
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
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [reviewingSubmission, setReviewingSubmission] = useState<ScoreEntry | null>(null);
  const [teacherScore, setTeacherScore] = useState(0);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [managedGames, setManagedGames] = useState<ManagedGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  useEffect(() => {
    const gamesQuery = query(collection(db, "managedGames"), orderBy("level", "asc"));
    const unsubscribeGames = onSnapshot(gamesQuery, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setManagedGames(gamesData);
      setIsLoadingGames(false);
    });
    if (!user) {
      setIsLoadingSubmissions(false);
      setIsLoadingUsers(false);
      return () => unsubscribeGames();
    };

    setIsLoadingSubmissions(true);
    const submissionsCol = collection(db, "gameSubmissions");
    const q = userRole === 'teacher'
      ? query(submissionsCol, orderBy("createdAt", "desc"))
      : query(submissionsCol, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsubscribeSubmissions = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScoreEntry));
      setSubmissions(data);
      setIsLoadingSubmissions(false);
    });

    let unsubscribeUsers = () => { };
    if (userRole === 'teacher') {
      setIsLoadingUsers(true);
      const usersQuery = query(collection(db, "users"));
      unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
        setAllUsers(usersData);
        setIsLoadingUsers(false);
      });
    } else {
      setIsLoadingUsers(false);
    }

    return () => {
      unsubscribeGames();
      unsubscribeSubmissions();
      unsubscribeUsers();
    };
  }, [user, userRole]);

  const unlockedGamesForSubmission = useMemo(() => {
    if (userRole !== 'student' || managedGames.length === 0) return managedGames;
    const PASSING_SCORE = 7;
    const highestApprovedScores = new Map<string, number>();
    submissions
      .filter(sub => sub.status === 'graded' || sub.status === 'approved')
      .forEach(sub => {
        const uniqueKey = `${sub.game}-L${sub.level}`;
        const existingScore = highestApprovedScores.get(uniqueKey) || 0;
        if (sub.score > existingScore) {
          highestApprovedScores.set(uniqueKey, sub.score);
        }
      });

    const result: ManagedGame[] = [];
    for (const game of managedGames) {
      if (game.level === 1) {
        result.push(game);
        continue;
      }
      const prevLevelGames = managedGames.filter(g => g.level === game.level - 1);
      if (prevLevelGames.length > 0) {
        const allPrevGamesPassed = prevLevelGames.every(prevGame => {
          const uniqueKey = `${prevGame.name}-L${prevGame.level}`;
          return (highestApprovedScores.get(uniqueKey) || 0) >= PASSING_SCORE;
        });
        if (allPrevGamesPassed) {
          result.push(game);
        }
      }
    }
    return result;
  }, [managedGames, submissions, userRole]);

  const userInfoMap = useMemo(() => new Map(allUsers.map(u => [u.uid, { name: u.namaLengkap, email: u.email }])), [allUsers]);

  const getStatusBadge = (status: ScoreEntry['status']) => {
    switch (status) {
      case 'pending': return <Badge className="text-orange-600 bg-orange-50"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu</Badge>;
      case 'approved': return <Badge className="text-blue-600 bg-blue-50"><Check className="w-3 h-3 mr-1" /> Disetujui</Badge>;
      case 'rejected': return <Badge className="text-red-600 bg-red-50"><X className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      case 'graded': return <Badge className="text-green-600 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" /> Telah Dinilai</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const openReviewModal = (submission: ScoreEntry) => {
    setTeacherFeedback(submission.teacherNote || "");
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
          level: reviewingSubmission.level,
          teacherNote: teacherFeedback
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server merespons dengan status ${res.status}`);
      const docRef = doc(db, "gameSubmissions", reviewingSubmission.id);
      await updateDoc(docRef, {
        status: "graded", feedback: data.feedback, teacherNote: teacherFeedback,
        score: teacherScore, rank: teacherScore >= 9 ? 'A+' : (teacherScore >= 7 ? 'A' : 'B+')
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
        status: "rejected", feedback: teacherFeedback, teacherNote: teacherFeedback
      });
      setReviewingSubmission(null);
    } catch (err: any) {
      setApprovalError("Gagal menolak kiriman.");
    } finally {
      setIsApproving(false);
    }
  };

  const isLoadingData = userRole === 'teacher'
    ? isLoadingSubmissions || isLoadingUsers
    : isLoadingSubmissions;

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
              <SubmitScoreForm user={user} setShowSubmitForm={setShowSubmitForm} availableGames={unlockedGamesForSubmission} />
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
                {submissions.map(sub => (
                  <Card key={sub.id} className={`hover:shadow-md transition-shadow ${sub.status === 'pending' ? 'border-orange-200' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center"><Trophy className="w-5 h-5 mr-2" /> {sub.game}</CardTitle>
                          <CardDescription className="mt-2">
                            {userRole === 'teacher' ? `Siswa: ${userInfoMap.get(sub.userId)?.name || sub.studentName}` : `Dimainkan pada ${sub.createdAt.toDate().toLocaleDateString('id-ID')}`}
                          </CardDescription>
                        </div>
                        {getStatusBadge(sub.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full" onClick={() => openReviewModal(sub)}>
                        <Eye className="w-4 h-4 mr-2" />
                        {userRole === 'teacher' ? 'Review Kiriman' : 'Lihat Detail'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
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
                <DialogTitle className="font-bold text-3xl">Game {reviewingSubmission.game}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm">
                  <span className="font-medium text-xl mr-2">
                    {userInfoMap.get(reviewingSubmission.userId)?.name || reviewingSubmission.studentName}
                  </span>
                  <span className="flex items-center text-lg mr-2 mt-1">
                    Level {reviewingSubmission.level || 'N/A'}
                  </span>
                  <span className="flex items-center text-lg mr-2 mt-1">
                    Skor Awal {reviewingSubmission.score}
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
                  {reviewingSubmission.note && (
                    <div className="space-y-2">
                      <Label className="flex items-center"><BookOpen className="w-4 h-4 mr-2 text-primary" /> Catatan dari Siswa</Label>
                      <div className="p-3 bg-muted rounded-lg border max-h-[150px] overflow-y-auto">
                        <p className="text-sm whitespace-pre-wrap">{reviewingSubmission.note}</p>
                      </div>
                    </div>
                  )}
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
                  {reviewingSubmission.feedback && (
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
                    Setujui & Hasilkan Feedback
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