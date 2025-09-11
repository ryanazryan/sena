/// <reference types="vite/client" />

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  Gamepad2, Upload, FileText, Clock, User, Calendar, CheckCircle,
  AlertCircle, Brain, TrendingUp, Award, Download, Eye, Send, Plus, Edit,
  Trophy, Target, Users, PlayCircle, Loader2, FileImage,
  Check, X
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
import { LucideIcon } from "lucide-react";
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

type StatCard = {
  icon: LucideIcon;
  label: string;
  value: string;
};

type ManagedGame = {
  id: string;
  name: string;
  link: string;
  deadline: Timestamp;
};

interface StudentGamesViewProps {
  user: FirebaseUser | null;
}

// --- STUDENT VIEW (UI DIKEMBALIKAN SEPERTI SEMULA DENGAN LOGIKA BARU) ---
const StudentGamesView = ({ user }: StudentGamesViewProps) => {
  const [games, setGames] = useState<ManagedGame[]>([]);
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const gamesCollection = collection(db, "managedGames");
    const q = query(gamesCollection, orderBy("deadline", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setGames(gamesData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    };
    const submissionsCol = collection(db, "gameSubmissions");
    const q = query(submissionsCol, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => doc.data() as ScoreEntry);
      setSubmissions(submissionsData);
      setIsLoading(false);
    }, () => setIsLoading(false));
    return () => unsubscribe();
  }, [user]);

  const highestStage1Score = useMemo(() => {
    if (games.length === 0) return 0;
    const stage1GameName = games[0].name;
    const stage1Submissions = submissions.filter(sub => sub.game === stage1GameName);
    if (stage1Submissions.length === 0) return 0;
    return Math.max(...stage1Submissions.map(s => s.score));
  }, [games, submissions]);
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Daftar Game Tersedia</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : games.length > 0 ? (
        <div className="space-y-4">
          {games.map((game, index) => {
            const isLocked = index > 0 && highestStage1Score < 7;
            return (
              <Card 
                key={game.id} 
                className={`transition-all ${isLocked ? 'border-gray-300 bg-gray-100' : 'border-2 border-green-600 bg-green-50/30'}`}
              >
                <CardContent className={`p-4 flex items-center justify-between ${isLocked ? 'opacity-50' : ''}`}>
                  <div className="space-y-1">
                    <p className={`flex items-center font-semibold text-base ${isLocked ? 'text-gray-500' : 'text-green-800'}`}>
                      <Target className="w-5 h-5 mr-2" />
                      {`Stage ${index + 1} - ${game.name}`}
                    </p>
                    <p className="text-sm text-muted-foreground ml-7">
                      Tenggat: {game.deadline.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Button 
                    
                    onClick={() => !isLocked && window.open(game.link, '_blank')}
                    disabled={isLocked}
                  >
                    {isLocked ? (
                      <>
                        <X className="w-4 h-4 mr-2" /> Terkunci
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 mr-2" /> {`Mulai Stage ${index + 1}`}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          {highestStage1Score > 0 && highestStage1Score < 7 && games.length > 1 && (
            <p className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mt-4 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 inline mr-2"/>
              Skor Stage 1 kamu adalah {highestStage1Score}. Dapatkan skor minimal 7 untuk membuka stage berikutnya. Semangat!
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">Belum ada game yang ditugaskan oleh guru.</p>
      )}
    </>
  );
};
// --- END OF STUDENT VIEW ---

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

  useEffect(() => {
    if (!user) return;
    setIsLoadingData(true);
    const submissionsCol = collection(db, "gameSubmissions");
    let q;
    if (userRole === 'teacher') {
      q = query(submissionsCol, orderBy("createdAt", "desc"));
      const usersQuery = query(collection(db, "users"));
      const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
        setAllUsers(usersData);
      });
      const unsubscribeSubmissions = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScoreEntry));
        setSubmissions(data);
        setIsLoadingData(false);
      });
      return () => {
        unsubscribeUsers();
        unsubscribeSubmissions();
      }
    } else {
      q = query(submissionsCol, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
      const unsubscribeSubmissions = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScoreEntry));
        setSubmissions(data);
        setIsLoadingData(false);
      }, (error) => console.error("Error fetching submissions: ", error));
      return () => unsubscribeSubmissions();
    }
  }, [user, userRole]);

  const userInfoMap = useMemo(() => {
    const map = new Map<string, { name: string; email: string }>();
    allUsers.forEach(u => {
      if (u.uid && u.email && u.namaLengkap) {
        map.set(u.uid, { name: u.namaLengkap, email: u.email });
      }
    });
    return map;
  }, [allUsers]);

  const validSubmissions = useMemo(() => {
    if (userRole === 'teacher') {
      const activeUserIds = new Set(allUsers.map(u => u.uid));
      return submissions.filter(sub => activeUserIds.has(sub.userId));
    }
    return submissions;
  }, [submissions, allUsers, userRole]);

  const getStatusBadge = (status: ScoreEntry['status']) => {
    switch (status) {
      case 'pending': return <Badge className="text-orange-600 bg-orange-50"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu Persetujuan</Badge>;
      case 'approved': return <Badge className="text-blue-600 bg-blue-50"><Check className="w-3 h-3 mr-1" /> Disetujui</Badge>;
      case 'rejected': return <Badge className="text-red-600 bg-red-50"><X className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      case 'graded': return <Badge className="text-green-600 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" /> Telah Dinilai (AI)</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatsForRole = (): StatCard[] => {
    const submissionsToCount = userRole === 'teacher' ? validSubmissions : submissions;
    if (userRole === 'teacher') {
      const pendingCount = submissionsToCount.filter(s => s.status === 'pending').length;
      return [
        { icon: Gamepad2, label: 'Games Tersedia', value: '3' },
        { icon: Users, label: 'Siswa Aktif', value: allUsers.length.toString() },
        { icon: Trophy, label: 'Total Kiriman', value: submissionsToCount.length.toString() },
        { icon: AlertCircle, label: 'Perlu Review', value: pendingCount.toString() }
      ];
    }
    const mySubmissions = submissionsToCount;
    const highestScore = mySubmissions.length ? Math.max(...mySubmissions.map(s => s.score)) : 0;
    return [
      { icon: Gamepad2, label: 'Games Dimainkan', value: mySubmissions.length.toString() },
      { icon: Trophy, label: 'Pencapaian', value: '15' },
      { icon: Target, label: 'Skor Tertinggi', value: highestScore.toString() },
      { icon: TrendingUp, label: 'Rata-rata', value: '83%' }
    ];
  };

  const stats = getStatsForRole();
  
  const SubmitScoreForm = () => {
    const [game, setGame] = useState("");
    const [score, setScore] = useState("");
    const [note, setNote] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [availableGames, setAvailableGames] = useState<ManagedGame[]>([]);

    useEffect(() => {
        const gamesCollection = collection(db, "managedGames");
        const q = query(gamesCollection, orderBy("deadline", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
            setAvailableGames(gamesData);
            if (gamesData.length > 0 && !game) {
                setGame(gamesData[0].name); 
            }
        });
        return () => unsubscribe();
    }, [game]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!score || !game || !file) {
        setError("Game, Skor, dan Screenshot wajib diisi.");
        return;
      }
      if (!user) {
        setError("Anda harus login untuk submit skor.");
        return;
      }
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);
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
        const screenshotUrl = data.secure_url;

        await addDoc(collection(db, "gameSubmissions"), {
          game: game,
          score: parseInt(score),
          maxScore: 10,
          note: note,
          screenshotUrl: screenshotUrl,
          userId: user.uid,
          studentName: user.displayName || user.email || "Siswa Sena",
          status: "pending",
          createdAt: Timestamp.now()
        });
        setSuccessMessage("Kiriman Anda berhasil disimpan.");
        setTimeout(() => {
          setShowSubmitForm(false);
          setSuccessMessage(null);
        }, 4000);
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
              <CardTitle className="flex items-center"><Send className="w-5 h-5 mr-2" /> Submit Nilai Game</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="game-select">Pilih Stage</Label>
                  <select id="game-select" className="w-full p-2 border rounded-lg bg-input mt-1" value={game} onChange={(e) => setGame(e.target.value)}>
                    {availableGames.map((g, index) => (
                        <option key={g.id} value={g.name}>{`Stage ${index + 1}: ${g.name}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="score-input">Skor Anda (1-10)</Label>
                  <Input id="score-input" placeholder="1-10" type="number" max="10" min="1" value={score} onChange={(e) => setScore(e.target.value)} required className="mt-1" />
                </div>
              </div>
              <div>
                <Label htmlFor="file-upload">Upload Screenshot Skor (Wajib)</Label>
                <label htmlFor="file-upload" className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer block mt-1">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">{fileName || "Klik untuk upload screenshot"}</p>
                  <p className="text-xs text-muted-foreground">Format: PNG, JPG (Max 5MB)</p>
                </label>
                <input id="file-upload" type="file" className="hidden" accept=".png,.jpg,.jpeg" onChange={handleFileChange} required />
              </div>
              <div>
                <Label htmlFor="note-input">Catatan Pengalaman (Opsional)</Label>
                <Textarea id="note-input" placeholder="Ceritakan pengalaman bermain game ini..." className="min-h-[100px] mt-1" value={note} onChange={(e) => setNote(e.target.value)} />
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
  
  const handleApprove = async () => {
    if (!reviewingSubmission) return;
    setIsApproving(true);
    setApprovalError(null);
    try {
      const res = await fetch('http://localhost:3001/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: teacherScore,
          note: reviewingSubmission.note || "Tidak ada catatan.",
          game: reviewingSubmission.game,
          teacherNote: teacherFeedback
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal dapat feedback AI.");
      
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
      setApprovalError(err.message || "Pastikan server AI berjalan.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!reviewingSubmission || !teacherFeedback) {
      setApprovalError("Catatan feedback wajib diisi untuk menolak kiriman.");
      return;
    }
    setIsApproving(true);
    setApprovalError(null);
    try {
      const docRef = doc(db, "gameSubmissions", reviewingSubmission.id);
      await updateDoc(docRef, {
        status: "rejected",
        feedback: teacherFeedback
      });
      setReviewingSubmission(null);
    } catch (err: any) {
      setApprovalError("Gagal menolak kiriman.");
    } finally {
      setIsApproving(false);
    }
  };

  const openReviewModal = (submission: ScoreEntry) => {
    setTeacherFeedback(submission.teacherNote || (submission.status === 'rejected' ? submission.feedback : '') || "");
    setTeacherScore(submission.score);
    setApprovalError(null);
    setReviewingSubmission(submission);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          SENA Games - Belajar Sambil Bermain
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher' ? 'Kelola game dan pantau progress siswa' : 'Tingkatkan literasi melalui game edukatif'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="flex items-center p-4">
                <Icon className={`w-8 h-8 ${stat.label === 'Perlu Review' && stat.value !== '0' ? 'text-orange-600' : 'text-primary'} mr-3`} />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="games" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="games">{userRole === 'teacher' ? 'Kelola Games' : 'Main Game'}</TabsTrigger>
          <TabsTrigger value="submit">{userRole === 'teacher' ? 'Review Siswa' : 'Submit Nilai'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="games" className="mt-6">
          {userRole === 'teacher' ? <TeacherGamesView /> : <StudentGamesView user={user} />}
        </TabsContent>

        <TabsContent value="submit" className="mt-6">
          {userRole === 'student' && showSubmitForm && (
            <div className="mb-6"><SubmitScoreForm /></div>
          )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {userRole === 'teacher' ? 'Daftar Kiriman Skor Siswa' : 'Riwayat Nilai Saya'}
              </h2>
              {userRole === 'student' && !showSubmitForm && (
                <Button onClick={() => setShowSubmitForm(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Submit Nilai Baru
                </Button>
              )}
            </div>
            {isLoadingData && (<div className="flex items-center justify-center h-40"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>)}
            {!isLoadingData && validSubmissions.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">{userRole === 'teacher' ? 'Belum Ada Kiriman' : 'Anda Belum Submit Nilai'}</h3>
                <p className="text-muted-foreground">{userRole === 'teacher' ? 'Data kiriman skor siswa akan muncul di sini.' : 'Klik "Submit Nilai Baru" untuk memulai.'}</p>
              </div>
            )}
            <div className="grid gap-4">
              {!isLoadingData && validSubmissions.map(sub => {
                const studentInfo = userInfoMap.get(sub.userId);
                const displayName = studentInfo?.name || sub.studentName || 'Siswa';
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
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{sub.score}</div>
                            <div className="text-xs text-muted-foreground">dari {sub.maxScore}</div>
                          </div>
                          <div className="flex-1">
                            <Progress value={(sub.score / sub.maxScore) * 100} className="mb-1" />
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {sub.createdAt.toDate().toLocaleDateString('id-ID')}</div>
                        </div>
                      </div>
                      {sub.feedback && (
                        <div className="mb-4 p-3 bg-muted rounded-lg border">
                          <p className="text-xs font-medium mb-1">
                            {sub.status === 'rejected' ? "Alasan Penolakan:" : "Feedback (AI + Guru):"}
                          </p>
                          <p className="text-sm italic whitespace-pre-wrap">{sub.feedback}</p>
                        </div>
                      )}
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
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!reviewingSubmission} onOpenChange={(open) => { if (!open) setReviewingSubmission(null); }}>
        <DialogContent className="sm:max-w-3xl">
          {reviewingSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>Review Kiriman: {reviewingSubmission.game}</DialogTitle>
                <DialogDescription className="flex items-center gap-4 pt-2">
                  <span>Siswa: {userInfoMap.get(reviewingSubmission.userId)?.name || reviewingSubmission.studentName}</span>
                  <span className="font-medium">Skor Diajukan: {reviewingSubmission.score}</span>
                  {getStatusBadge(reviewingSubmission.status)}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  <h4 className="font-medium">Bukti Screenshot Siswa</h4>
                  <div className="border rounded-lg overflow-hidden aspect-video">
                    <ImageWithFallback src={reviewingSubmission.screenshotUrl} alt="Screenshot kiriman siswa" className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-medium pt-4">Catatan Siswa</h4>
                  <div className="p-3 bg-muted rounded-lg border min-h-[50px]">
                    <p className="text-sm italic">{reviewingSubmission.note || "Siswa tidak memberikan catatan."}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Verifikasi & Feedback</h4>
                  <p className="text-sm text-muted-foreground">
                    Verifikasi skor dan berikan feedback.
                  </p>
                  <div className="space-y-2">
                    <Label>Skor Final (1-10)</Label>
                    <Input type="number" value={teacherScore} onChange={(e) => setTeacherScore(parseInt(e.target.value))} max="10" min="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Catatan / Feedback Guru</Label>
                    <Textarea placeholder="Tuliskan feedback Anda..." className="min-h-[120px]" value={teacherFeedback} onChange={(e) => setTeacherFeedback(e.target.value)} />
                  </div>
                  {reviewingSubmission.status === 'graded' && reviewingSubmission.feedback && (
                    <div className="space-y-2">
                      <Label className="flex items-center"><Brain className="w-4 h-4 mr-2 text-primary" /> Feedback AI (Final)</Label>
                      <div className="p-3 bg-muted rounded-lg border max-h-40 overflow-y-auto">
                        <p className="text-sm italic whitespace-pre-wrap">{reviewingSubmission.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {approvalError && (<div className="text-sm text-destructive flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4" /> {approvalError}</div>)}
              <DialogFooter className="pt-4 border-t">
                  <Button variant="destructive" onClick={handleReject} disabled={isApproving}><X className="w-4 h-4 mr-2" /> Tolak</Button>
                  <Button onClick={handleApprove} disabled={isApproving} className="bg-green-600 hover:bg-green-700">
                    {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                    {reviewingSubmission.status === 'graded' ? 'Perbarui Feedback AI' : 'Setujui & Hasilkan Feedback AI'}
                  </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}