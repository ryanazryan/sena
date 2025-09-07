import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { 
  ArrowLeft, 
  GamepadIcon,
  Search, 
  Filter, 
  Plus,
  MoreVertical,
  Play,
  Pause,
  Edit3,
  Trash2,
  Users,
  Clock,
  Star,
  Settings,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Eye,
  Copy,
  TrendingUp
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ManageGamesPageProps {
  user: {
    type: 'student' | 'teacher';
    email: string;
    name?: string;
  };
  onBack: () => void;
}

export function ManageGamesPage({ user, onBack }: ManageGamesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");

  // Mock games data
  const games = [
    {
      id: 1,
      title: "Petualangan Literasi Nusantara",
      subject: "Bahasa Indonesia",
      difficulty: "Pemula",
      status: "active",
      players: 156,
      avgScore: 82,
      completionRate: 78,
      lastPlayed: "2 jam lalu",
      description: "Game literasi yang mengajarkan pemahaman bacaan melalui cerita rakyat Indonesia",
      duration: "30-45 menit",
      levels: 8,
      badges: 5,
      createdDate: "2024-12-15",
      playData: [
        { name: "Sen", players: 12 },
        { name: "Sel", players: 19 },
        { name: "Rab", players: 15 },
        { name: "Kam", players: 22 },
        { name: "Jum", players: 18 },
        { name: "Sab", players: 25 },
        { name: "Min", players: 20 }
      ]
    },
    {
      id: 2,
      title: "Matematika Seru",
      subject: "Matematika",
      difficulty: "Menengah",
      status: "draft",
      players: 0,
      avgScore: 0,
      completionRate: 0,
      lastPlayed: "Belum dimainkan",
      description: "Game matematika interaktif untuk melatih operasi hitung dasar",
      duration: "20-30 menit",
      levels: 6,
      badges: 3,
      createdDate: "2025-01-05",
      playData: []
    },
    {
      id: 3,
      title: "Eksplorasi IPA",
      subject: "IPA",
      difficulty: "Lanjutan",
      status: "maintenance",
      players: 89,
      avgScore: 75,
      completionRate: 65,
      lastPlayed: "1 hari lalu",
      description: "Jelajahi dunia sains melalui eksperimen virtual yang menarik",
      duration: "45-60 menit",
      levels: 10,
      badges: 7,
      createdDate: "2024-11-20",
      playData: [
        { name: "Sen", players: 8 },
        { name: "Sel", players: 12 },
        { name: "Rab", players: 10 },
        { name: "Kam", players: 15 },
        { name: "Jum", players: 11 },
        { name: "Sab", players: 18 },
        { name: "Min", players: 14 }
      ]
    }
  ];

  // Mock analytics data
  const gameAnalytics = {
    totalGames: 15,
    activeGames: 12,
    totalPlayers: 450,
    avgCompletionRate: 74
  };

  const popularSubjects = [
    { subject: "Bahasa Indonesia", players: 156, color: "#14b8a6" },
    { subject: "Matematika", players: 134, color: "#0ea5e9" },
    { subject: "IPA", players: 89, color: "#8b5cf6" },
    { subject: "IPS", players: 71, color: "#f59e0b" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 border-green-200';
      case 'draft': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'inactive': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'draft': return <Edit3 className="w-4 h-4 text-gray-600" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'inactive': return <Pause className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-green-100 text-green-800';
      case 'Menengah': return 'bg-yellow-100 text-yellow-800';
      case 'Lanjutan': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || game.status === filterStatus;
    const matchesSubject = filterSubject === "all" || game.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="text-gray-600 hover:text-teal-600 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Dashboard
              </Button>
              <div className="hidden md:block h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-lg">
                  <span className="text-lg font-bold">SENA</span>
                </div>
                <span className="text-xl text-gray-800">Kelola Permainan</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <GamepadIcon className="w-4 h-4 text-teal-500" />
              <span>Manajemen Games</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Permainan 🎮
          </h1>
          <p className="text-lg text-gray-600">
            Buat, edit, dan kelola game edukasi untuk siswa Anda
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Total Games</h3>
                  <p className="text-3xl font-bold">{gameAnalytics.totalGames}</p>
                </div>
                <GamepadIcon className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Games Aktif</h3>
                  <p className="text-3xl font-bold">{gameAnalytics.activeGames}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Total Pemain</h3>
                  <p className="text-3xl font-bold">{gameAnalytics.totalPlayers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Rata-rata Selesai</h3>
                  <p className="text-3xl font-bold">{gameAnalytics.avgCompletionRate}%</p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="games">Daftar Games</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="create">Buat Game Baru</TabsTrigger>
          </TabsList>

          {/* Games List Tab */}
          <TabsContent value="games" className="space-y-6 mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <GamepadIcon className="w-6 h-6 text-teal-500" />
                    <span>Daftar Permainan</span>
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-500 hover:bg-teal-600">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Game
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tambah Game Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="gameTitle">Judul Game</Label>
                          <Input id="gameTitle" placeholder="Masukkan judul game" />
                        </div>
                        <div>
                          <Label htmlFor="gameSubject">Mata Pelajaran</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih mata pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bahasa-indonesia">Bahasa Indonesia</SelectItem>
                              <SelectItem value="matematika">Matematika</SelectItem>
                              <SelectItem value="ipa">IPA</SelectItem>
                              <SelectItem value="ips">IPS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="gameDifficulty">Tingkat Kesulitan</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tingkat kesulitan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pemula">Pemula</SelectItem>
                              <SelectItem value="menengah">Menengah</SelectItem>
                              <SelectItem value="lanjutan">Lanjutan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="gameDescription">Deskripsi</Label>
                          <Textarea id="gameDescription" placeholder="Deskripsi game" rows={3} />
                        </div>
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">
                          Buat Game
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari game..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Mapel</SelectItem>
                      <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                      <SelectItem value="Matematika">Matematika</SelectItem>
                      <SelectItem value="IPA">IPA</SelectItem>
                      <SelectItem value="IPS">IPS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Games List */}
                <div className="space-y-4">
                  {filteredGames.map((game) => (
                    <div key={game.id} className={`p-6 rounded-lg border-2 ${getStatusColor(game.status)}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{game.title}</h3>
                            {getStatusIcon(game.status)}
                            <Badge variant="outline" className="text-xs">
                              {game.subject}
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(game.difficulty)}`}>
                              {game.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{game.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{game.players} pemain</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Star className="w-4 h-4" />
                              <span>Rata-rata: {game.avgScore}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>Selesai: {game.completionRate}%</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{game.duration}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit3 className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="w-4 h-4 mr-1" />
                            Duplikat
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Game Statistics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{game.levels}</div>
                          <div className="text-xs text-gray-500">Level</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{game.badges}</div>
                          <div className="text-xs text-gray-500">Badge</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="text-lg font-bold text-gray-900">{game.completionRate}%</div>
                          <div className="text-xs text-gray-500">Completion</div>
                        </div>
                      </div>

                      {/* Weekly Play Data Chart */}
                      {game.playData.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Aktivitas 7 Hari Terakhir</h4>
                          <div className="h-20">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={game.playData}>
                                <Bar dataKey="players" fill="#14b8a6" radius={2} />
                                <Tooltip />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/50">
                        <span className="text-xs text-gray-500">Terakhir dimainkan: {game.lastPlayed}</span>
                        <div className="flex items-center space-x-2">
                          <Switch checked={game.status === 'active'} />
                          <span className="text-xs text-gray-500">
                            {game.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredGames.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <GamepadIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Tidak ada game yang ditemukan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Popular Subjects Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    <span>Mata Pelajaran Populer</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={popularSubjects}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="players"
                        >
                          {popularSubjects.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4">
                    {popularSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          ></div>
                          <span className="text-sm text-gray-700">{subject.subject}</span>
                        </div>
                        <span className="text-sm font-medium">{subject.players} pemain</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Game Performance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-green-500" />
                    <span>Performa Game</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {games.slice(0, 3).map((game, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{game.title}</h4>
                        <Badge className={getDifficultyColor(game.difficulty)}>
                          {game.difficulty}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pemain</span>
                          <span className="font-medium">{game.players}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Rata-rata Nilai</span>
                          <span className="font-medium">{game.avgScore}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Completion Rate</span>
                          <span className="font-medium">{game.completionRate}%</span>
                        </div>
                        <Progress value={game.completionRate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Create Game Tab */}
          <TabsContent value="create" className="space-y-6 mt-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-6 h-6 text-teal-500" />
                  <span>Buat Game Edukasi Baru</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="newGameTitle">Judul Game</Label>
                      <Input id="newGameTitle" placeholder="Masukkan judul game yang menarik" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newGameSubject">Mata Pelajaran</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih mata pelajaran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bahasa-indonesia">Bahasa Indonesia</SelectItem>
                            <SelectItem value="matematika">Matematika</SelectItem>
                            <SelectItem value="ipa">IPA</SelectItem>
                            <SelectItem value="ips">IPS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="newGameDifficulty">Tingkat Kesulitan</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tingkat" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pemula">Pemula</SelectItem>
                            <SelectItem value="menengah">Menengah</SelectItem>
                            <SelectItem value="lanjutan">Lanjutan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newGameDescription">Deskripsi Game</Label>
                      <Textarea 
                        id="newGameDescription" 
                        placeholder="Jelaskan tujuan pembelajaran dan cara bermain game ini..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="newGameDuration">Durasi (menit)</Label>
                        <Input id="newGameDuration" type="number" placeholder="30" />
                      </div>
                      <div>
                        <Label htmlFor="newGameLevels">Jumlah Level</Label>
                        <Input id="newGameLevels" type="number" placeholder="5" />
                      </div>
                      <div>
                        <Label htmlFor="newGameBadges">Jumlah Badge</Label>
                        <Input id="newGameBadges" type="number" placeholder="3" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border-2 border-dashed border-teal-200">
                      <div className="text-center">
                        <GamepadIcon className="w-12 h-12 mx-auto mb-3 text-teal-500" />
                        <h3 className="font-semibold text-gray-900 mb-2">Preview Game</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Upload gambar cover untuk game Anda
                        </p>
                        <Button variant="outline">
                          Upload Gambar
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Pengaturan Lanjutan</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Aktifkan Game</Label>
                          <p className="text-sm text-gray-500">Game akan langsung tersedia untuk siswa</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mode Kompetisi</Label>
                          <p className="text-sm text-gray-500">Siswa dapat berkompetisi dengan teman</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Tracking Progress</Label>
                          <p className="text-sm text-gray-500">Rekam progress detail setiap siswa</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-teal-500 hover:bg-teal-600" size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Game
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}