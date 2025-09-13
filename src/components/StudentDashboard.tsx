import { useState, useEffect, useMemo, useRef } from "react";
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
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

import image1 from "../assets/level_1.png";
import image2 from "../assets/level_2.png";
import image3 from "../assets/level_3.png";

const carouselImages = [image1, image2, image3];

interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
}

type ManagedGame = {
  id: string;
  name: string;
  level: number;
  link: string;
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

  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

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

    const gamesQuery = query(collection(db, "managedGames"), orderBy("level", "asc"));
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

  const firstGameLink = useMemo(() => {
    if (managedGames && managedGames.length > 0) {
      return managedGames[0].link;
    }
    return null;
  }, [managedGames]);

  const levelProgress = useMemo(() => {
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

    const unlockedGames: any[] = [];

    for (let i = 0; i < managedGames.length; i++) {
      const game = managedGames[i];
      let isUnlocked = false;

      if (game.level === 1) {
        isUnlocked = true;
      } else {
        const prevLevelGames = managedGames.filter(g => g.level === game.level - 1);
        if (prevLevelGames.length > 0) {
          const allPrevGamesPassed = prevLevelGames.every(prevGame => {
            const uniqueKey = `${prevGame.name}-L${prevGame.level}`;
            return (highestApprovedScores.get(uniqueKey) || 0) >= PASSING_SCORE;
          });
          if (allPrevGamesPassed) {
            isUnlocked = true;
          }
        }
      }

      if (isUnlocked) {
        const uniqueKey = `${game.name}-L${game.level}`;
        unlockedGames.push({
          id: game.id,
          name: `Level ${game.level}: ${game.name}`,
          score: highestApprovedScores.get(uniqueKey) || 0,
          maxScore: 10,
          link: game.link,
        });
      } else {
        break;
      }
    }

    return unlockedGames;
  }, [submissions, managedGames]);

  const calculatedStats = useMemo(() => {
    const approvedSubmissions = submissions.filter(s => s.status === 'graded' || s.status === 'approved');
    const count = new Set(approvedSubmissions.map(s => `${s.game}-L${s.level}`)).size;

    if (count === 0) {
      return {
        highestScore: 0,
        submissionCount: 0,
        level: "Pemula",
      };
    }

    const maxScore = Math.max(...approvedSubmissions.map((sub) => sub.score), 0);

    const highestLevelCompleted = Math.max(0, ...approvedSubmissions.map(s => s.level));

    let levelText = "Pemula";
    if (highestLevelCompleted >= 2) {
      levelText = "Menengah";
    }
    if (highestLevelCompleted >= 3) {
      levelText = "Mahir";
    }

    return {
      highestScore: maxScore,
      submissionCount: count,
      level: levelText,
    };
  }, [submissions]);

  const stats = [
    { icon: Trophy, label: "Skor Tertinggi", value: calculatedStats.highestScore },
    { icon: Brain, label: "Level Saat Ini", value: calculatedStats.level },
    { icon: BookOpen, label: "Game Selesai", value: calculatedStats.submissionCount },
    { icon: Star, label: "Pencapaian", value: "-" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 space-y-8">
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
          <Carousel
            plugins={[plugin.current]}
            opts={{ loop: true }}
            className="w-full"
            onMouseEnter={() => plugin.current.stop()}
            onMouseLeave={() => plugin.current.reset()}
          >
            <CarouselContent>
              {carouselImages.map((imgSrc, index) => (
                <CarouselItem key={index}>
                  <div
                    className="relative rounded-lg overflow-hidden flex items-center justify-center h-full p-1 min-h-[160px] md:min-h-[180px] cursor-pointer" // Tambahkan cursor-pointer
                    style={{
                      backgroundImage: `url(${imgSrc})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    onClick={() => {
                      if (firstGameLink) {
                        window.open(firstGameLink, '_blank');
                      } else {
                        console.log("Game belum tersedia");
                      }
                    }}
                  >
                    <div className="absolute inset-0" />
                    <Card className="w-full bg-transparent border-none text-white text-center">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg md:text-xl"></CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center p-4 pt-2 mt-6">

                        {/* Ikon Play besar di tengah */}
                        <PlayCircle className="w-12 h-12 text-white opacity-80" />

                        {/* Tombol Kuning sebagai pengganti <p> */}
                        <Button
                          className="mt-4 bg-[--warning] text-[--warning-foreground] hover:bg-[--warning]/90 focus-visible:ring-[--warning] pointer-events-none"
                          size="sm"
                        >
                          {firstGameLink ? "Mulai Petualangan" : "Game Belum Tersedia"}
                        </Button>

                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <Card className="flex flex-col h-full">
            <CardHeader>
              <CardTitle>Buku Panduan</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center flex-1">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-blue-600 mb-4" />
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