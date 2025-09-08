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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface StudentDashboardProps {
  onSectionChange: (section: string) => void;
  userRole?: 'student' | 'teacher' | null;
}

// Data dummy untuk chart
const progressData = [
  { name: 'Jan', score: 60 },
  { name: 'Feb', score: 65 },
  { name: 'Mar', score: 72 },
  { name: 'Apr', score: 80 },
  { name: 'Mei', score: 85 },
];

export function StudentDashboard({ onSectionChange, userRole }: StudentDashboardProps) {
  const stats = [
    { icon: Trophy, label: 'Skor Tertinggi', value: '950' },
    { icon: Brain, label: 'Level Saat Ini', value: 'Menengah' },
    { icon: BookOpen, label: 'Game Diselesaikan', value: '8' },
    { icon: Star, label: 'Pencapaian', value: '12' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground">Halo, Pengguna!</h1>
        <p className="text-muted-foreground">Ini adalah ringkasan perkembangan literasi Anda.</p>
      </div>

      {/* Main Content: Progress Chart & Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Chart Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Perkembangan Nilai Literasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#488000" activeDot={{ r: 8 }} />
                </LineChart>
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

      {/* Stats Section */}
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