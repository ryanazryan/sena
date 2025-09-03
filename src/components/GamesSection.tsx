import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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
  GraduationCap
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GamesSectionProps {
  userRole?: 'student' | 'teacher' | null;
}

export function GamesSection({ userRole }: GamesSectionProps) {
  const [selectedGame, setSelectedGame] = useState("literasi-adventure");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedScore, setSelectedScore] = useState(null);



  const scores = [
    {
      id: 1,
      game: "Literasi Adventure",
      score: 850,
      maxScore: 1000,
      date: "2025-01-02",
      duration: "18 menit",
      rank: "A",
      achievements: ["Perfect Round", "Speed Bonus"]
    },
    {
      id: 2,
      game: "Word Master Challenge",
      score: 720,
      maxScore: 1000,
      date: "2025-01-01",
      duration: "25 menit",
      rank: "B+",
      achievements: ["Vocabulary Expert"]
    },
    {
      id: 3,
      game: "Story Builder Pro",
      score: 920,
      maxScore: 1000,
      date: "2024-12-30",
      duration: "45 menit",
      rank: "A+",
      achievements: ["Creative Master", "Plot Twist Genius", "Character Developer"]
    }
  ];

  const recommendations = [
    {
      type: "game",
      title: "Reading Comprehension Master",
      description: "Game khusus untuk meningkatkan pemahaman bacaan",
      difficulty: "Sedang",
      estimatedTime: "30 menit",
      reason: "Berdasarkan performa Anda di Literasi Adventure"
    },
    {
      type: "book",
      title: "Laskar Pelangi - Andrea Hirata",
      description: "Novel inspiratif tentang pendidikan dan persahabatan",
      category: "Fiksi Indonesia",
      reason: "Sesuai dengan minat Anda pada Story Builder Pro"
    },
    {
      type: "activity",
      title: "Writing Workshop: Character Development",
      description: "Workshop online tentang pengembangan karakter dalam cerita",
      duration: "2 jam",
      reason: "Melengkapi skill dari Story Builder Pro"
    }
  ];

  const guideBooks = [
    {
      id: 1,
      title: "Panduan Lengkap SENA Games",
      description: "Panduan komprehensif untuk semua game di platform SENA",
      pages: 45,
      size: "2.3 MB",
      downloadUrl: "#",
      category: "Umum"
    },
    {
      id: 2,
      title: "Strategi Master Literasi Adventure",
      description: "Tips dan trik untuk mencapai skor maksimal",
      pages: 28,
      size: "1.8 MB",
      downloadUrl: "#",
      category: "Game Specific"
    },
    {
      id: 3,
      title: "Writing Techniques for Story Builder",
      description: "Teknik menulis kreatif untuk game Story Builder Pro",
      pages: 35,
      size: "2.1 MB",
      downloadUrl: "#",
      category: "Writing"
    },
    {
      id: 4,
      title: "Vocabulary Building Guide",
      description: "Panduan membangun kosakata untuk Word Master Challenge",
      pages: 52,
      size: "3.2 MB",
      downloadUrl: "#",
      category: "Vocabulary"
    }
  ];



  const getRankColor = (rank: string) => {
    if (rank.startsWith('A')) return "text-green-600 bg-green-50";
    if (rank.startsWith('B')) return "text-blue-600 bg-blue-50";
    return "text-orange-600 bg-orange-50";
  };

  const getStatsForRole = () => {
    if (userRole === 'teacher') {
      return [
        { icon: Gamepad2, label: 'Games Tersedia', value: '12' },
        { icon: Users, label: 'Siswa Aktif', value: '156' },
        { icon: Trophy, label: 'Total Submissions', value: '342' },
        { icon: TrendingUp, label: 'Avg Score', value: '78%' }
      ];
    }
    return [
      { icon: Gamepad2, label: 'Games Dimainkan', value: '8' },
      { icon: Trophy, label: 'Pencapaian', value: '15' },
      { icon: Target, label: 'Skor Tertinggi', value: '920' },
      { icon: TrendingUp, label: 'Rata-rata', value: '83%' }
    ];
  };

  const stats = getStatsForRole();

  const SubmitScoreForm = () => (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Submit Nilai Game
        </CardTitle>
        <CardDescription>Submit skor game Anda untuk penilaian dan feedback</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Pilih Game</label>
            <select className="w-full p-2 border rounded-lg">
              <option value="literasi-adventure">Literasi Adventure</option>
              <option value="word-master">Word Master Challenge</option>
              <option value="story-builder">Story Builder Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Skor Anda</label>
            <Input placeholder="Masukkan skor (0-1000)" type="number" max="1000" min="0" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Screenshot Skor (Opsional)</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload screenshot skor untuk verifikasi
            </p>
            <p className="text-xs text-muted-foreground">
              Format: PNG, JPG (Max 5MB)
            </p>
            <input type="file" className="hidden" accept=".png,.jpg,.jpeg" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Catatan Pengalaman</label>
          <Textarea 
            placeholder="Ceritakan pengalaman bermain game ini..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Nilai
          </Button>
          <Button variant="outline" onClick={() => setShowSubmitForm(false)}>
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <Gamepad2 className="w-8 h-8 mr-3 text-primary" />
          SENA Games - Belajar Sambil Bermain
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher'
            ? 'Kelola game pembelajaran dan pantau progress siswa dalam pembelajaran gamifikasi'
            : 'Tingkatkan kemampuan literasi Anda melalui game edukatif yang seru dan menantang'
          }
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="flex items-center p-4">
                <Icon className="w-8 h-8 text-blue-600 mr-3" />
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
          <TabsTrigger value="games">
            {userRole === 'teacher' ? 'Kelola Games' : 'Main Game'}
          </TabsTrigger>
          <TabsTrigger value="submit">Submit Nilai</TabsTrigger>
          <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
        </TabsList>

        {/* Games Tab */}
        <TabsContent value="games" className="mt-6">
          {/* Featured Game Link */}
          <Card className="mb-6 border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <PlayCircle className="w-6 h-6 mr-3 text-primary" />
                  SENA Games Collection
                </div>
                <Badge className="bg-primary">Terbaru</Badge>
              </CardTitle>
              <CardDescription>
                Kumpulan game edukatif terlengkap untuk pembelajaran literasi interaktif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center mb-1">
                        <Users className="w-4 h-4 mr-1" />
                        2,790+ pemain aktif
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500" />
                        4.8/5 rating
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => window.open('https://s.id/senagames', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Main Sekarang
                  </Button>
                </div>

                {/* Buku Panduan Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center mb-3">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-semibold">Buku Panduan PDF</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download panduan lengkap untuk memaksimalkan pengalaman bermain game edukatif
                  </p>
                  
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
                          <Button size="sm" className="flex-1 h-7 text-xs">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


        </TabsContent>

        {/* Submit Scores Tab */}
        <TabsContent value="submit" className="mt-6">
          {showSubmitForm ? (
            <div className="mb-6">
              <SubmitScoreForm />
            </div>
          ) : null}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {userRole === 'teacher' ? 'Nilai Siswa' : 'Riwayat Nilai'}
              </h2>
              {userRole !== 'teacher' && (
                <Button onClick={() => setShowSubmitForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Nilai Baru
                </Button>
              )}
            </div>
            
            <div className="grid gap-4">
              {scores.map(score => (
                <Card key={score.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          <Trophy className="w-5 h-5 mr-2" />
                          {score.game}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Dimainkan pada {new Date(score.date).toLocaleDateString('id-ID')}
                        </CardDescription>
                      </div>
                      <Badge className={getRankColor(score.rank)}>
                        Rank {score.rank}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{score.score}</div>
                          <div className="text-xs text-muted-foreground">dari {score.maxScore}</div>
                        </div>
                        <div className="flex-1">
                          <Progress value={(score.score / score.maxScore) * 100} className="mb-1" />
                          <div className="text-xs text-muted-foreground">
                            {Math.round((score.score / score.maxScore) * 100)}% skor maksimal
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {score.duration}
                        </div>
                      </div>
                    </div>
                    
                    {score.achievements.length > 0 && (
                      <div className="mb-3">
                        <div className="text-xs font-medium mb-2">Pencapaian:</div>
                        <div className="flex flex-wrap gap-1">
                          {score.achievements.map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </Button>
                      {userRole === 'teacher' && (
                        <Button variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Beri Feedback
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Rekomendasi Personal</h2>
              <p className="text-muted-foreground mb-6">
                Berdasarkan aktivitas dan performa Anda, berikut rekomendasi untuk meningkatkan kemampuan literasi
              </p>
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
                      <Badge variant="outline">
                        {rec.type === 'game' ? 'Game' : rec.type === 'book' ? 'Buku' : 'Aktivitas'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {rec.difficulty && (
                        <div className="flex items-center text-sm">
                          <Target className="w-4 h-4 mr-2" />
                          <span className="font-medium">Tingkat:</span>
                          <Badge variant="outline" className="ml-2">
                            {rec.difficulty}
                          </Badge>
                        </div>
                      )}
                      
                      {rec.estimatedTime && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          Estimasi waktu: {rec.estimatedTime}
                        </div>
                      )}
                      
                      {rec.duration && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          Durasi: {rec.duration}
                        </div>
                      )}
                      
                      {rec.category && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Kategori: {rec.category}
                        </div>
                      )}
                      
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs font-medium mb-1">Alasan Rekomendasi:</div>
                        <div className="text-xs text-muted-foreground">{rec.reason}</div>
                      </div>
                      
                      <Button className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        {rec.type === 'game' ? 'Main Game' : rec.type === 'book' ? 'Baca Buku' : 'Ikuti Aktivitas'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>


      </Tabs>
    </div>
  );
}