import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, PlayCircle, X } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";

export type ScoreEntry = {
  id: string;
  userId: string;
  studentName?: string;
  game: string;
  level: number;
  score: number;
  maxScore: number;
  status: 'pending' | 'approved' | 'rejected' | 'graded';
  createdAt: any;
};

export type ManagedGame = {
  id: string;
  name: string;
  link: string;
  level: number;
};

interface StudentGamesViewProps {
  user: FirebaseUser | null;
  games: ManagedGame[];
  isLoadingGames: boolean;
}

export const StudentGamesView = ({ user, games, isLoadingGames }: StudentGamesViewProps) => {
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    const submissionsCol = collection(db, "gameSubmissions");
    const q = query(submissionsCol, where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ScoreEntry));
      setSubmissions(submissionsData);
    });
    return () => unsubscribe();
  }, [user]);

  const highestApprovedScores = useMemo(() => {
    const scoreMap = new Map<string, number>();
    submissions.filter(sub => sub.status === 'graded' || sub.status === 'approved')
      .forEach(sub => {
        const existingScore = scoreMap.get(sub.game) || 0;
        if (sub.score > existingScore) scoreMap.set(sub.game, sub.score);
      });
    return scoreMap;
  }, [submissions]);

  const unlockedGames = useMemo(() => {
    if (!games || games.length === 0) return [];

    const PASSING_SCORE = 7;
    const result: ManagedGame[] = [];

    // Map level -> games
    const levelMap = new Map<number, ManagedGame[]>();
    games.forEach(g => {
      if (!levelMap.has(g.level)) levelMap.set(g.level, []);
      levelMap.get(g.level)!.push(g);
    });

    const levels = Array.from(levelMap.keys()).sort((a, b) => a - b);
    let canUnlockNextLevel = true;

    for (const level of levels) {
      const gamesAtLevel = levelMap.get(level)!;
      if (!canUnlockNextLevel) break;

      // Semua game di level ini harus lulus untuk membuka level berikutnya
      const allPassed = gamesAtLevel.every(g => (highestApprovedScores.get(g.name) || 0) >= PASSING_SCORE);

      result.push(...gamesAtLevel);

      canUnlockNextLevel = allPassed;
    }

    return result;
  }, [games, highestApprovedScores]);

  if (isLoadingGames) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!games || games.length === 0) {
    return <p className="text-center text-muted-foreground py-10">Belum ada game yang ditugaskan.</p>;
  }

  return (
    <div className="space-y-4">
      {games.map(game => {
        const isUnlocked = unlockedGames.some(g => g.id === game.id);
        return (
          <Card key={game.id} className={`transition-all hover:shadow-md ${isUnlocked ? 'border-2 border-green-600 bg-green-50/30' : 'border-gray-300 bg-gray-100'}`}>
            <CardContent className={`p-4 flex items-center justify-between ${!isUnlocked ? 'opacity-50' : ''}`}>
              <div className="space-y-1">
                <p className={`font-semibold text-base ${isUnlocked ? 'text-green-800' : 'text-gray-500'}`}>{game.name}</p>
                <p className="text-sm text-muted-foreground">Level {game.level}</p>
              </div>
              <Button onClick={() => isUnlocked && window.open(game.link, '_blank')} disabled={!isUnlocked}>
                {isUnlocked ? <><PlayCircle className="w-4 h-4 mr-2" /> Mulai Level {game.level}</> : <><X className="w-4 h-4 mr-2" /> Terkunci</>}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
