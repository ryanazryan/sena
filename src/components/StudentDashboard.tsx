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

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Trophy,
  Brain,
  BookOpen,
  Star,
  PlayCircle,
  FileText,
  CalendarDays, // <-- Icon baru untuk Agenda
} from "lucide-react";

// Tipe data submission (tidak berubah)
interface Submission {
  id?: string;
  userId: string;
  score: number;
  aiFeedback?: string;
}

// Props (tidak berubah)
interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
}

// Data dummy BARU untuk Agenda Game Mingguan
const gameSchedule = [
  { week: 1, game: "Game: Menemukan Informasi", status: "Selesai" },
  { week: 2, game: "Game: Interpretasi Teks", status: "Aktif" },
  { week: 3, game: "Game: Refleksi Pengalaman", status: "Terkunci" },
  { week: 4, game: "Game: Analisis Kritis", status: "Terkunci" },
];

export function StudentDashboard({ user, userProfile, onSectionChange }: StudentDashboardProps) {

  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Hook untuk data fetching (tidak berubah)
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
      })) as Submission[];
      setSubmissions(subsData);
    });

    return () => unsubscribe();
  }, [user]); 

  // Kalkulasi statistik (tidak berubah)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground">Halo, {userProfile.namaLengkap}!</h1>
        <p className="text-muted-foreground">Ini adalah ringkasan perkembangan literasi Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* === KARTU DIAGRAM DIGANTI DENGAN KARTU AGENDA KALENDER === */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
               <CalendarDays className="w-5 h-5 mr-2" />
               Agenda Game Literasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gameSchedule.map((item) => (
                <div 
                  key={item.week} 
                  className="flex items-center space-x-4 p-3 bg-card-foreground/5 dark:bg-card-foreground/10 rounded-lg"
                >
                  <div className="flex flex-col items-center justify-center p-2 bg-primary rounded-md w-16 min-w-[4rem]">
                     <span className="text-xs font-medium text-primary-foreground">PEKAN</span>
                     <span className="text-xl font-bold text-primary-foreground">{item.week}</span>
                  </div>
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
        {/* === AKHIR PERUBAHAN === */}


        {/* Action Cards (Tidak diubah) */}
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
              <Button onClick={() => onSectionChange('library')} variant="outline" className="w-full">
                Baca Panduan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section (Tidak diubah, tetap dinamis) */}
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