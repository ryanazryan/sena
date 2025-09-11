import { useState, useEffect, useMemo } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Download, Eye, Target, PlayCircle, Loader2, X, AlertCircle } from "lucide-react";

// Tipe data ini bisa diimpor dari file lain jika sudah ada
type ManagedGame = {
  id: string;
  name: string;
  link: string;
  deadline: Timestamp;
};

type ScoreEntry = {
  game: string;
  score: number;
  userId: string;
  // tambahkan properti lain jika diperlukan
};

// Definisikan props untuk StudentGamesView
interface StudentGamesViewProps {
  user: FirebaseUser | null;
}

export const StudentGamesView = ({ user }: StudentGamesViewProps) => {
  const [games, setGames] = useState<ManagedGame[]>([]);
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mengambil daftar game yang dibuat oleh guru
  useEffect(() => {
    const gamesCollection = collection(db, "managedGames");
    const q = query(gamesCollection, orderBy("deadline", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setGames(gamesData);
    }, (error) => {
      console.error("Error fetching games for student: ", error);
    });
    return () => unsubscribe();
  }, []);

  // Mengambil riwayat submission nilai milik siswa yang sedang login
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
    }, (error) => {
      console.error("Error fetching submissions for student: ", error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  // Logika untuk menentukan skor tertinggi di Stage 1
  const highestStage1Score = useMemo(() => {
    if (games.length === 0) return 0;
    const stage1GameName = games[0].name;
    const stage1Submissions = submissions.filter(sub => sub.game === stage1GameName);
    if (stage1Submissions.length === 0) return 0;
    return Math.max(...stage1Submissions.map(s => s.score));
  }, [games, submissions]);
  
  return (
    <>
      <Card className="mb-8 p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Panduan Lengkap SENA Games</CardTitle>
            <CardDescription className="text-sm mt-1">
              Panduan komprehensif untuk semua stage pembelajaran dengan tips dan strategi bermain yang efektif.
            </CardDescription>
            <div className="flex text-xs text-muted-foreground space-x-4 mt-2">
              <span>45 halaman</span>
              <span>2.8 MB</span>
            </div>
          </div>
          <div className="flex gap-2 self-stretch md:self-center">
            <Button className="bg-green-600 hover:bg-green-700 w-full"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
            <Button variant="outline" size="icon"><Eye className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

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
                <CardContent className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isLocked ? 'opacity-50' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`flex items-center font-semibold text-base ${isLocked ? 'text-gray-500' : 'text-green-800'}`}>
                        <Target className="w-5 h-5 mr-3" />
                        {`Stage ${index + 1} - ${game.name}`}
                      </p>
                      <Badge className={`hidden sm:flex ${isLocked ? 'bg-gray-400' : 'bg-green-700 text-white'}`}>
                        {`Tenggat: ${game.deadline.toDate().toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}`}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 ml-8">
                      Tenggat Pengerjaan: {game.deadline.toDate().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Button 
                    className={`w-full sm:w-auto self-end ${!isLocked ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'}`}
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

          {highestStage1Score < 7 && games.length > 1 && (
            <p className="text-center text-sm text-orange-600 bg-orange-50 p-3 rounded-lg mt-4 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 inline mr-2"/>
              Kamu harus mendapatkan skor minimal 7 di Stage 1 untuk membuka stage berikutnya. Semangat!
            </p>
          )}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10">Belum ada game yang ditugaskan oleh guru.</p>
      )}
    </>
  );
};