import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Trophy, 
  Brain, 
  BookOpen, 
  Star, 
  PlayCircle,
  FileText
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ScoreEntry } from "../App";

interface StudentDashboardProps {
  onSectionChange: (section: string) => void;
  userRole?: 'student' | 'teacher' | null;
  submissions: ScoreEntry[];
}

// Data dummy untuk BarChart
const levelDistributionData = [
  { name: 'Kurang', games: 2 },
  { name: 'Menengah', games: 5 },
  { name: 'Baik', games: 8 },
  { name: 'Sangat Baik', games: 3 },
];

export function StudentDashboard({ onSectionChange, userRole, submissions }: StudentDashboardProps) {
  
  // Mengolah data submissions untuk chart
  const progressData = submissions.map(sub => ({
    name: sub.createdAt.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    score: sub.score
  }));

  // Mengolah data submissions untuk statistik
  const totalGames = submissions.length;
  const highestScore = submissions.reduce((max, sub) => Math.max(max, sub.score), 0);
  const totalAchievements = submissions.reduce((count, sub) => count + (sub.achievements?.length || 0), 0);
  const currentLevel = "Menengah"; // Logika level bisa ditambahkan di sini

  const stats = [
    { icon: Trophy, label: 'Skor Tertinggi', value: highestScore.toString() },
    { icon: Brain, label: 'Level Saat Ini', value: currentLevel },
    { icon: BookOpen, label: 'Game Diselesaikan', value: totalGames.toString() },
    { icon: Star, label: 'Pencapaian', value: totalAchievements.toString() },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground">Halo, Pengguna!</h1>
        <p className="text-muted-foreground">Ini adalah ringkasan perkembangan literasi Anda.</p>
      </div>

      {/* Main Content: Progress Chart & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Distribusi Nilai Berdasarkan Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={levelDistributionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="games" fill="#488000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
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