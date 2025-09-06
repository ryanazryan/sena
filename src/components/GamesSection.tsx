import { useState, useEffect, useCallback } from "react"; 
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
  DialogClose, // Import DialogClose untuk tombol tutup
} from "./ui/dialog"; 
import { 
  Gamepad2, 
  Upload, 
  FileText, 
  Clock, 
  User, 
  Star,
  Calendar,
  CheckCircle,
  AlertCircle, 
  BookOpen,
  Brain,
  TrendingUp,
  Award,
  Download,
  Eye,
  Send,
  Plus,
  Edit,
  ExternalLink,
  Trophy,
  Target,
  Users,
  PlayCircle,
  GraduationCap,
  Loader2,
  FileImage, 
  Check, 
  X 
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import { db, storage } from "../lib/firebase"; 
import { 
    collection, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    updateDoc,
    addDoc,
    orderBy,
    Timestamp 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User as FirebaseUser } from "firebase/auth";
import { Label } from "./ui/label";

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
  duration?: string;
  rank?: string;
  achievements?: string[];
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

  // --- MENGAMBIL DATA REAL-TIME DARI FIRESTORE ---
  useEffect(() => {
    if (!user) return; 

    setIsLoadingData(true);
    let q; 

    const submissionsCol = collection(db, "gameSubmissions"); 

    if (userRole === 'teacher') {
      q = query(submissionsCol, orderBy("createdAt", "desc"));
    } else {
      q = query(
          submissionsCol, 
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: ScoreEntry[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ScoreEntry);
      });
      setSubmissions(data);
      setIsLoadingData(false);
    }, (error) => {
      console.error("Error fetching submissions: ", error);
      setIsLoadingData(false);
    });

    return () => unsubscribe();

  }, [user, userRole]); 


  const recommendations = [
    { type: "game", title: "Reading Comprehension Master", description: "Game khusus untuk meningkatkan pemahaman bacaan", difficulty: "Sedang", estimatedTime: "30 menit", reason: "Berdasarkan performa Anda di Literasi Adventure" },
    { type: "book", title: "Laskar Pelangi - Andrea Hirata", description: "Novel inspiratif tentang pendidikan dan persahabatan", category: "Fiksi Indonesia", reason: "Sesuai dengan minat Anda pada Story Builder Pro" },
    { type: "activity", title: "Writing Workshop: Character Development", description: "Workshop online tentang pengembangan karakter dalam cerita", duration: "2 jam", reason: "Melengkapi skill dari Story Builder Pro" }
  ];

  const guideBooks = [
    { id: 1, title: "Panduan Lengkap SENA Games", description: "Panduan komprehensif untuk semua game", pages: 45, size: "2.3 MB", downloadUrl: "#", category: "Umum" },
    { id: 2, title: "Strategi Master Literasi Adventure", description: "Tips dan trik untuk skor maksimal", pages: 28, size: "1.8 MB", downloadUrl: "#", category: "Game Specific" },
  ];

  const getRankColor = (rank?: string) => {
    if (!rank) return "text-gray-600 bg-gray-50";
    if (rank.startsWith('A')) return "text-green-600 bg-green-50";
    if (rank.startsWith('B')) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const getStatusBadge = (status: ScoreEntry['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="text-orange-600 bg-orange-50"><AlertCircle className="w-3 h-3 mr-1" /> Menunggu Persetujuan</Badge>;
      case 'approved':
        return <Badge className="text-blue-600 bg-blue-50"><Check className="w-3 h-3 mr-1" /> Disetujui</Badge>;
      case 'rejected':
        return <Badge className="text-red-600 bg-red-50"><X className="w-3 h-3 mr-1" /> Ditolak</Badge>;
      case 'graded':
        return <Badge className="text-green-600 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" /> Telah Dinilai (AI)</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatsForRole = () => {
    if (userRole === 'teacher') {
      const pendingCount = submissions.filter(s => s.status === 'pending').length;
      return [
        { icon: Gamepad2, label: 'Games Tersedia', value: '12' }, 
        { icon: Users, label: 'Siswa Aktif', value: '156' }, 
        { icon: Trophy, label: 'Total Kiriman', value: submissions.length.toString() }, 
        { icon: AlertCircle, label: 'Perlu Review', value: pendingCount.toString() } 
      ];
    }
    const mySubmissions = submissions; 
    const highestScore = mySubmissions.length ? Math.max(...mySubmissions.map(s => s.score)) : 0;
    return [
      { icon: Gamepad2, label: 'Games Dimainkan', value: mySubmissions.length.toString() },
      { icon: Trophy, label: 'Pencapaian', value: '15' }, 
      { icon: Target, label: 'Skor Tertinggi', value: highestScore.toString() },
      { icon: TrendingUp, label: 'Rata-rata', value: '83%' } 
    ];
  };

  const stats = getStatsForRole();

  // --- KOMPONEN FORM SUBMIT SISWA (MENGGUNAKAN FIREBASE SDK LANGSUNG) ---
  const SubmitScoreForm = () => {
    const [game, setGame] = useState("Literasi Adventure");
    const [score, setScore] = useState("");
    const [note, setNote] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState("");
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); 

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
        // 1. Upload file ke Storage
        const storageRef = ref(storage, `game-screenshots/${user.uid}/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const screenshotUrl = await getDownloadURL(uploadResult.ref);

        // 2. Simpan data langsung ke Firestore (menggantikan pemanggilan API submit-score)
        await addDoc(collection(db, "gameSubmissions"), {
          game: game,
          score: parseInt(score),
          maxScore: 1000, 
          note: note,
          screenshotUrl: screenshotUrl,
          userId: user.uid,
          studentName: user.displayName || user.email || "Siswa Sena",
          status: "pending", // STATUS WAJIB PENDING
          createdAt: Timestamp.now() // Gunakan Timestamp server
        });
        
        setSuccessMessage("Kiriman Anda berhasil disimpan dan sedang menunggu review dari Guru.");

        setTimeout(() => {
           setShowSubmitForm(false);
           setSuccessMessage(null);
           // Data akan refresh otomatis karena listener onSnapshot
        }, 4000);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan saat submit.");
      } finally {
        setIsSubmitting(false);
      }
    };

    // (Tampilan Form Sukses dan Form Input tetap sama)
    if (successMessage) {
      return (
         <Card className="border-green-500">
           <CardHeader><CardTitle className="text-green-700 flex items-center"><CheckCircle className="w-5 h-5 mr-2" /> Berhasil Disimpan!</CardTitle></CardHeader>
           <CardContent className="space-y-4">
             <div className="p-4 bg-muted rounded-lg border"><p className="text-sm italic">{successMessage}</p></div>
             <Button variant="outline" onClick={() => setShowSubmitForm(false)}>Tutup</Button>
           </CardContent>
         </Card>
      );
    }

    return (
       <Card className="border-primary">
         <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center"><Send className="w-5 h-5 mr-2" /> Submit Nilai Game</CardTitle>
            <CardDescription>Submit skor game Anda untuk penilaian dan feedback AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="game-select">Pilih Game</Label>
                <select id="game-select" className="w-full p-2 border rounded-lg bg-input-background mt-1" value={game} onChange={(e) => setGame(e.target.value)}>
                  <option value="Literasi Adventure">Literasi Adventure</option>
                  <option value="Word Master Challenge">Word Master Challenge</option>
                  <option value="Story Builder Pro">Story Builder Pro</option>
                </select>
              </div>
              <div>
                <Label htmlFor="score-input">Skor Anda</Label>
                <Input id="score-input" placeholder="0-1000" type="number" max="1000" min="0" value={score} onChange={(e) => setScore(e.target.value)} required className="mt-1" />
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
  
  // --- FUNGSI APPROVAL GURU (REAL DATABASE) ---
  const handleApprove = async () => {
      if (!reviewingSubmission) return;
      
      setIsApproving(true);
      setApprovalError(null);

      try {
          // 1. Panggil API feedback.ts Anda (API ini memanggil Gemini)
          const res = await fetch('/api/feedback', { // Pastikan API ini ada di /api/feedback
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  score: teacherScore, 
                  note: reviewingSubmission.note || "Tidak ada catatan siswa.",
                  game: reviewingSubmission.game,
                  teacherNote: teacherFeedback 
              })
          });
          
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Gagal mendapat feedback AI.");

          // 2. Update dokumen di Firestore setelah dapat feedback AI
          const docRef = doc(db, "gameSubmissions", reviewingSubmission.id);
          await updateDoc(docRef, {
              status: "graded", 
              feedback: data.feedback, // KOREKSI: Menyimpan feedback AI ke bidang 'feedback'
              teacherNote: teacherFeedback, 
              score: teacherScore, 
              rank: teacherScore >= 900 ? 'A+' : (teacherScore >= 800 ? 'A' : 'B+')
          });
          
          setReviewingSubmission(null);
          setTeacherFeedback("");

      } catch (err: any) {
          console.error(err);
          setApprovalError(err.message || "Gagal memproses persetujuan.");
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
                feedback: teacherFeedback // Simpan alasan penolakan di bidang 'feedback'
           });
           setReviewingSubmission(null);
           setTeacherFeedback("");
       } catch(err: any) {
            console.error(err);
            setApprovalError("Gagal menolak kiriman.");
       } finally {
            setIsApproving(false);
       }
  };

  const openReviewModal = (submission: ScoreEntry) => {
    setTeacherFeedback(submission.teacherNote || (submission.status !== 'graded' ? submission.feedback : '') || ""); // Hanya load feedback jika BUKAN feedback AI (atau load teacherNote)
    setTeacherScore(submission.score);
    setApprovalError(null); 
    setReviewingSubmission(submission);
  };
  
  // --- UI UTAMA (Return) ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          SENA Games - Belajar Sambil Bermain
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher' ? 'Kelola game pembelajaran dan pantau progress siswa' : 'Tingkatkan literasi Anda melalui game edukatif'}
        </p>
      </div>

      {/* Stats Cards (Dinamis) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="flex items-center p-4">
                <Icon className={`w-8 h-8 ${stat.label === 'Perlu Review' && stat.value !== '0' ? 'text-orange-600' : 'text-blue-600'} mr-3`} />
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="games">{userRole === 'teacher' ? 'Kelola Games' : 'Main Game'}</TabsTrigger>
          <TabsTrigger value="submit">{userRole === 'teacher' ? 'Review Siswa' : 'Submit Nilai'}</TabsTrigger>
          <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
        </TabsList>

        {/* Tab Games (Statis) */}
        <TabsContent value="games" className="mt-6">
           <Card className="mb-6 border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
             <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center"><PlayCircle className="w-6 h-6 mr-3 text-primary" /> SENA Games Collection</div>
                <Badge className="bg-primary">Terbaru</Badge>
              </CardTitle>
              <CardDescription>Kumpulan game edukatif terlengkap untuk pembelajaran literasi interaktif</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center mb-1"><Users className="w-4 h-4 mr-1" /> 2,790+ pemain aktif</div>
                      <div className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" /> 4.8/5 rating</div>
                    </div>
                  </div>
                  <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => window.open('https://s.id/senagames', '_blank')}>
                    <ExternalLink className="w-4 h-4 mr-2" /> Main Sekarang
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center mb-3"><FileText className="w-5 h-5 mr-2 text-primary" /> <h3 className="font-semibold">Buku Panduan PDF</h3></div>
                  <p className="text-sm text-muted-foreground mb-4">Download panduan lengkap untuk memaksimalkan pengalaman bermain game.</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {guideBooks.map(book => (
                      <div key={book.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm leading-tight">{book.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{book.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs ml-2 shrink-0">{book.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{book.pages} hal</span>
                          <span>{book.size}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" className="flex-1 h-7 text-xs"><Download className="w-3 h-3 mr-1" /> Download</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2"><Eye className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Submit (Dinamis) */}
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

            {!isLoadingData && submissions.length === 0 && (
                <div className="text-center py-12">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">{userRole === 'teacher' ? 'Belum Ada Kiriman' : 'Anda Belum Submit Nilai'}</h3>
                    <p className="text-muted-foreground">{userRole === 'teacher' ? 'Data kiriman skor siswa akan muncul di sini.' : 'Klik "Submit Nilai Baru" untuk memulai.'}</p>
                </div>
            )}
            
            <div className="grid gap-4">
              {!isLoadingData && submissions.map(sub => (
                <Card key={sub.id} className={`hover:shadow-md transition-shadow ${sub.status === 'pending' ? 'border-orange-200' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center"><Trophy className="w-5 h-5 mr-2" /> {sub.game}</CardTitle>
                        <CardDescription className="mt-2">
                           {userRole === 'teacher' ? `Siswa: ${sub.studentName}` : `Dimainkan pada ${sub.createdAt.toDate().toLocaleDateString('id-ID')}`}
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
                    
                    {/* KOREKSI: Tampilkan feedback HANYA jika ada (baik itu feedback AI atau feedback/alasan penolakan dari guru) */}
                    {sub.feedback && (
                        <div className="mb-4 p-3 bg-muted rounded-lg border">
                           <p className="text-xs font-medium mb-1">
                             {sub.status === 'rejected' ? "Alasan Penolakan:" : (sub.status === 'graded' ? "Feedback (AI + Guru):" : "Feedback:")}
                           </p>
                           <p className="text-sm italic whitespace-pre-wrap">{sub.feedback}</p>
                        </div>
                    )}
                    
                    <div className="flex gap-2">
                      {userRole === 'teacher' ? (
                        <Button 
                            className="flex-1" 
                            onClick={() => openReviewModal(sub)}
                            variant={sub.status === 'pending' ? 'default' : 'secondary'}
                        >
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
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab Rekomendasi (Statis) */}
        <TabsContent value="recommendations" className="mt-6">
           <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Rekomendasi Personal</h2>
              <p className="text-muted-foreground mb-6">Berdasarkan aktivitas dan performa Anda, berikut rekomendasi untuk meningkatkan kemampuan literasi.</p>
            </div>
            <div className="grid gap-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          {rec.type === 'game' && <Gamepad2 className="w-5 h-5 mr-2 text-blue-600" />}
                          {rec.type === 'book' && <BookOpen className="w-5 h-5 mr-2 text-green-600" />}
                          {rec.type === 'activity' && <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />}
                          {rec.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{rec.description}</CardDescription>
                      </div>
                      <Badge variant="outline">{rec.type === 'game' ? 'Game' : rec.type === 'book' ? 'Buku' : 'Aktivitas'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rec.difficulty && (<div className="flex items-center text-sm"><Target className="w-4 h-4 mr-2" /> <span className="font-medium">Tingkat:</span><Badge variant="outline" className="ml-2">{rec.difficulty}</Badge></div>)}
                      {rec.estimatedTime && (<div className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-2" /> Estimasi waktu: {rec.estimatedTime}</div>)}
                      {rec.duration && (<div className="flex items-center text-sm text-muted-foreground"><Clock className="w-4 h-4 mr-2" /> Durasi: {rec.duration}</div>)}
                      {rec.category && (<div className="flex items-center text-sm text-muted-foreground"><BookOpen className="w-4 h-4 mr-2" /> Kategori: {rec.category}</div>)}
                      <div className="p-3 bg-muted rounded-lg"><div className="text-xs font-medium mb-1">Alasan Rekomendasi:</div><div className="text-xs text-muted-foreground">{rec.reason}</div></div>
                      <Button className="w-full"><Eye className="w-4 h-4 mr-2" /> {rec.type === 'game' ? 'Main Game' : rec.type === 'book' ? 'Baca Buku' : 'Ikuti Aktivitas'}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* --- MODAL APPROVAL (UI Gabungan Guru/Siswa) --- */}
      <Dialog open={!!reviewingSubmission} onOpenChange={(open) => { if (!open) setReviewingSubmission(null); }}>
          <DialogContent className="sm:max-w-3xl">
              {reviewingSubmission && (
                  <>
                      <DialogHeader>
                          <DialogTitle>Review Kiriman: {reviewingSubmission.game}</DialogTitle>
                          <DialogDescription className="flex items-center gap-4 pt-2">
                              <span>Siswa: {reviewingSubmission.studentName}</span>
                              <span className="font-medium">Skor Diajukan: {reviewingSubmission.score}</span>
                              {getStatusBadge(reviewingSubmission.status)}
                          </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                          {/* Kolom Bukti Screenshot */}
                          <div className="space-y-4">
                              <h4 className="font-medium">Bukti Screenshot Siswa</h4>
                              <div className="border rounded-lg overflow-hidden aspect-video">
                                  <ImageWithFallback
                                      src={reviewingSubmission.screenshotUrl}
                                      alt="Screenshot kiriman siswa"
                                      className="w-full h-full object-cover"
                                  />
                              </div>
                                <h4 className="font-medium pt-4">Catatan Siswa</h4>
                                <div className="p-3 bg-muted rounded-lg border min-h-[50px]">
                                   <p className="text-sm italic">{reviewingSubmission.note || "Siswa tidak memberikan catatan."}</p>
                                </div>
                          </div>
                          
                          {/* Kolom Feedback Guru & AI */}
                          <div className="space-y-4">
                                <h4 className="font-medium">Verifikasi & Feedback</h4>
                                <p className="text-sm text-muted-foreground">
                                   {userRole === 'teacher' ? "Verifikasi skor dan berikan feedback. Menyetujui akan memicu feedback AI." : "Detail kiriman dan feedback dari guru atau AI."}
                                </p>
                                <div className="space-y-2">
                                  <Label>Skor Final (Verifikasi)</Label>
                                  <Input 
                                      type="number" 
                                      value={teacherScore}
                                      onChange={(e) => setTeacherScore(parseInt(e.target.value))}
                                      max="1000" 
                                      min="0"
                                      readOnly={userRole !== 'teacher' || reviewingSubmission.status === 'graded'} // Kunci jika sudah dinilai AI
                                  />
                                </div>
                                <div className="space-y-2">
                                   <Label>Catatan / Feedback Guru</Label>
                                   <Textarea 
                                      placeholder={userRole === 'teacher' ? "Tuliskan feedback Anda di sini..." : (reviewingSubmission.teacherNote || "Menunggu feedback guru...")}
                                      className="min-h-[120px]"
                                      value={teacherFeedback}
                                      onChange={(e) => setTeacherFeedback(e.target.value)}
                                      readOnly={userRole !== 'teacher' || reviewingSubmission.status === 'graded'} // Kunci jika sudah dinilai AI
                                  />
                                </div>

                                {/* KOREKSI: Tampilkan Feedback AI (hanya dari bidang 'feedback') JIKA status = graded */}
                                {reviewingSubmission.status === 'graded' && reviewingSubmission.feedback && (
                                     <div className="space-y-2">
                                       <Label className="flex items-center"><Brain className="w-4 h-4 mr-2 text-primary" /> Feedback AI (Final)</Label>
                                       <div className="p-3 bg-muted rounded-lg border max-h-40 overflow-y-auto">
                                          <p className="text-sm italic whitespace-pre-wrap">{reviewingSubmission.feedback}</p>
                                       </div>
                                     </div>
                                )}
                                {/* Tampilkan feedback manual (penolakan) JIKA status = rejected */}
                                {reviewingSubmission.status === 'rejected' && reviewingSubmission.feedback && (
                                     <div className="space-y-2">
                                       <Label className="flex items-center text-destructive"><X className="w-4 h-4 mr-2" /> Alasan Penolakan</Label>
                                       <div className="p-3 bg-red-50 border-red-200 rounded-lg border">
                                          <p className="text-sm italic text-destructive-foreground (ini salah, harusnya text-red-700)">{reviewingSubmission.feedback}</p>
                                       </div>
                                     </div>
                                )}
                          </div>
                      </div>

                      {approvalError && (<div className="text-sm text-destructive flex items-center gap-2 mb-2"><AlertCircle className="w-4 h-4" /> {approvalError}</div>)}

                      {userRole === 'teacher' && reviewingSubmission.status !== 'graded' ? (
                          <DialogFooter className="pt-4 border-t">
                              <Button 
                                  variant="destructive" 
                                  onClick={handleReject} 
                                  disabled={isApproving}
                              >
                                  <X className="w-4 h-4 mr-2" /> Tolak
                              </Button>
                              <Button 
                                  onClick={handleApprove} 
                                  disabled={isApproving}
                                  className="bg-green-600 hover:bg-green-700"
                              >
                                  {isApproving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                                  Setujui & Hasilkan Feedback AI
                              </Button>
                          </DialogFooter>
                      ) : (
                         <DialogFooter className="pt-4 border-t">
                            <DialogClose asChild>
                              <Button variant="outline">Tutup</Button>
                            </DialogClose>
                         </DialogFooter>
                      )}
                  </>
              )}
          </DialogContent>
      </Dialog>
    </div>
  );
}