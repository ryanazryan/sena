// File: src/components/StudentDashboard.tsx

import { useState, useEffect, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { UserProfile } from "../lib/auth";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress"; // --- BARU: Impor Progress ---
import {
  Trophy,
  Brain,
  BookOpen,
  Star,
  PlayCircle,
  FileText,
} from "lucide-react";
import { ScoreEntry } from "../App";
import { Calendar } from "../components/ui/calendar";

interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
}

type ManagedGame = {
  id: string;
  name: string;
  stage: number;
  deadline?: Timestamp;
};

export function StudentDashboard({
  user,
  userProfile,
  onSectionChange,
}: StudentDashboardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);
  const [managedGames, setManagedGames] = useState<ManagedGame[]>([]);

  useEffect(() => {
    if (!user) return;

    const subsQuery = query(
      collection(db, "gameSubmissions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeSubs = onSnapshot(subsQuery, (snapshot) => {
      const subsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ScoreEntry[];
      setSubmissions(subsData);
    });

    const gamesQuery = query(collection(db, "managedGames"), orderBy("stage", "asc"));
    const unsubscribeGames = onSnapshot(gamesQuery, (snapshot) => {
        const gamesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ManagedGame[];
        setManagedGames(gamesData);
    });

    return () => {
        unsubscribeSubs();
        unsubscribeGames();
    };
  }, [user]);

  const deadlines = useMemo(() => {
    return managedGames
      .filter(game => game.deadline)
      .map(game => game.deadline!.toDate());
  }, [managedGames]);

  // --- LOGIKA BARU: Menyiapkan data untuk diagram progres ---
  const levelProgress = useMemo(() => {
    // Cari skor tertinggi untuk setiap game yang sudah dinilai/disetujui
    const highestApprovedScores = new Map<string, number>();
    submissions
        .filter(sub => sub.status === 'graded' || sub.status === 'approved')
        .forEach(sub => {
            const existingScore = highestApprovedScores.get(sub.game) || 0;
            if (sub.score > existingScore) {
                highestApprovedScores.set(sub.game, sub.score);
            }
        });

    // Petakan data game dengan skor tertinggi
    return managedGames.map(game => ({
        id: game.id,
        name: `Level ${game.stage}: ${game.name}`,
        score: highestApprovedScores.get(game.name) || 0,
        maxScore: 10,
    }));
  }, [submissions, managedGames]);
  // --- SELESAI ---

  const calculatedStats = useMemo(() => {
    const approvedSubmissions = submissions.filter(s => s.status === 'graded' || s.status === 'approved');
    const count = new Set(approvedSubmissions.map(s => s.game)).size; // Hitung game unik
    if (count === 0) {
      return {
        highestScore: 0,
        submissionCount: 0,
        level: "Pemula",
      };
    }
    const maxScore = Math.max(...approvedSubmissions.map((sub) => sub.score), 0);
    return {
      highestScore: maxScore,
      submissionCount: count,
      level: "Menengah", // Placeholder
    };
  }, [submissions]);

  const stats = [
    { icon: Trophy, label: "Skor Tertinggi", value: calculatedStats.highestScore },
    { icon: Brain, label: "Level Saat Ini", value: calculatedStats.level },
    { icon: BookOpen, label: "Game Selesai", value: calculatedStats.submissionCount },
    { icon: Star, label: "Pencapaian", value: "-" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-center md:justify-start text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Halo, {userProfile.namaLengkap} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Ini adalah ringkasan perkembangan literasi Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* --- KARTU PROGRES DIGANTI DENGAN DIAGRAM --- */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">Progres Pembelajaran</CardTitle>
            <CardDescription>Skor tertinggi Anda untuk setiap level.</CardDescription>
          </CardHeader>
          <CardContent>
            {levelProgress.length > 0 ? (
              <div className="space-y-4">
                {levelProgress.map((level) => (
                  <div key={level.id}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{level.name}</p>
                      <p className="text-sm font-semibold text-primary">{level.score} / {level.maxScore}</p>
                    </div>
                    <Progress value={(level.score / level.maxScore) * 100} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Belum ada progres. Ayo mulai mainkan game pertama!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center items-center">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                classNames={{
                    cell: "h-16 w-16 text-center text-sm p-0",
                    day: "h-12 w-12",
                    head_cell: "w-12 font-normal text-sm",
                    caption_label: "text-lg font-medium",
                }}
                modifiers={{ deadline: deadlines }}
                modifiersClassNames={{
                  deadline: "deadline-dot",
                }}
            />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bermain Game</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary mb-4" />
              <Button onClick={() => onSectionChange("games")} className="w-full">
                Mulai Petualangan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Buku Panduan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-blue-600 mb-4" />
              <Button asChild variant="outline" className="w-full">
                <a href="/BUKU PANDUAN PENGGUNAAN MEDIA.pdf" download="Panduan Belajar SENA.pdf">
                  Unduh Panduan
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}