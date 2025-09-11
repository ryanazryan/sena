import { useState, useEffect, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { UserProfile } from "../lib/auth";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ScoreEntry } from "../App";

type ManagedGame = {
  id: string;
  name: string;
  link: string;
  deadline: Timestamp;
  stage: number;
};

interface StudentDashboardProps {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
}

export function StudentDashboard({ user, userProfile, onSectionChange }: StudentDashboardProps) {
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);
  const [games, setGames] = useState<ManagedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "gameSubmissions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subsData = snapshot.docs.map(doc => doc.data() as ScoreEntry);
      setSubmissions(subsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const gamesCollection = collection(db, "managedGames");
    const q = query(gamesCollection, orderBy("stage", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setGames(gamesData);
    });
    return () => unsubscribe();
  }, []);

  const stageScores = useMemo(() => {
    const scores: { [key: number]: number | string } = { 1: '-', 2: '-', 3: '-' };
    [1, 2, 3].forEach(stageNumber => {
      const gameNamesForStage = games
        .filter(g => g.stage === stageNumber)
        .map(g => g.name);

      if (gameNamesForStage.length > 0) {
        const submissionsForStage = submissions.filter(s => gameNamesForStage.includes(s.game));
        if (submissionsForStage.length > 0) {
          scores[stageNumber] = Math.max(...submissionsForStage.map(s => s.score));
        }
      }
    });
    return scores;
  }, [submissions, games]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Halo, {userProfile.namaLengkap} 👋</h1>
        <p className="text-muted-foreground mt-2">Ini adalah ringkasan skor game literasi Anda.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laporan Skor per Stage</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Memuat data...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 font-semibold">Nama Siswa</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold text-center">Skor Stage 1</th>
                    <th className="p-4 font-semibold text-center">Skor Stage 2</th>
                    <th className="p-4 font-semibold text-center">Skor Stage 3</th>
                    <th className="p-4 font-semibold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4">{userProfile.namaLengkap}</td>
                    <td className="p-4">{userProfile.email}</td>
                    <td className="p-4 text-center font-medium">{stageScores[1]}</td>
                    <td className="p-4 text-center font-medium">{stageScores[2]}</td>
                    <td className="p-4 text-center font-medium">{stageScores[3]}</td>
                    <td className="p-4 text-center">
                      <Button variant="outline" size="sm" onClick={() => onSectionChange('games')}>
                        Lihat Game
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-center">
        <Button onClick={() => onSectionChange('games')} size="lg">
          Mulai Bermain Game
        </Button>
      </div>
    </div>
  );
}