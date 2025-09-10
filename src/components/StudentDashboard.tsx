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
} from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
import logo from "../assets/logo.png";

interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
}

const gameSchedule = [
  { week: 1, game: "Stage 1: Mengakses dan Menemukan Informasi", status: "Selesai" },
  { week: 2, game: "Stage 2: Menginterpretasi dan Mengintegrasi", status: "Aktif" },
  { week: 3, game: "Stage 3: Mengevaluasi dan Merefleksi", status: "Terkunci" },
];

export function StudentDashboard({ user, userProfile, onSectionChange }: StudentDashboardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "gameSubmissions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScoreEntry[];
      setSubmissions(subsData);
    });

    return () => unsubscribe();
  }, [user]);

  const calculatedStats = useMemo(() => {
    const count = submissions.length;

    if (count === 0) {
      return {
        highestScore: 0,
        submissionCount: 0,
        level: "Pemula",
      };
    }

    const maxScore = Math.max(...submissions.map(sub => sub.score));
    const levelFromAI = "Menengah"; // Placeholder

    return {
      highestScore: maxScore,
      submissionCount: count,
      level: levelFromAI,
    };
  }, [submissions]);

  const stats = [
    { icon: Trophy, label: 'Skor Tertinggi', value: calculatedStats.highestScore },
    { icon: Brain, label: 'Level Saat Ini', value: calculatedStats.level },
    { icon: BookOpen, label: 'Game Diselesaikan', value: calculatedStats.submissionCount },
    { icon: Star, label: 'Pencapaian', value: '-' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-center md:justify-start text-center md:text-left">
        {/* <img src={logo} alt="SENA Logo" className="w-10 h-10 mr-4 hidden md:block" /> */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Halo, {userProfile.namaLengkap} 👋</h1>
          <p className="text-muted-foreground mt-2">Ini adalah ringkasan perkembangan literasi Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              Agenda Game Literasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {gameSchedule.map((item) => (
                <div
                  key={item.week}
                  className="flex items-center space-x-4 p-2 bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg"
                >

                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{item.game}</h4>
                    <p className="text-sm text-muted-foreground">Status: {item.status}</p>
                  </div>

                  {item.status === 'Aktif' && (
                    <Button size="sm" onClick={() => onSectionChange('games')}>Mainkan</Button>
                  )}
                  {item.status === 'Selesai' && (
                    <Badge variant="outline" className="text-green-500 border-green-500">Selesai</Badge>
                  )}
                  {item.status === 'Terkunci' && (
                    <Badge variant="secondary">Terkunci</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <CardContent className="flex justify-center">
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
          />
        </CardContent>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bermain Game</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <PlayCircle className="w-12 h-12 text-primary mb-4" />
              <Button onClick={() => onSectionChange('games')} className="w-full">
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
                <a href="/panduan_sena.pdf" download="Panduan Belajar SENA.pdf">
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

