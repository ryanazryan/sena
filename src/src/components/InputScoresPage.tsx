import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArrowLeft, PlusCircle, Save, TrendingUp, Calendar, BookOpen, Star, Target, Award, Lightbulb, ChevronRight } from "lucide-react";

interface InputScoresPageProps {
  user: {
    type: 'student' | 'teacher';
    email: string;
    name?: string;
  };
  onBack: () => void;
}

export function InputScoresPage({ user, onBack }: InputScoresPageProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");

  const subjects = [
    "Bahasa Indonesia"
  ];

  const games = [
    { name: "Petualangan Literasi Nusantara", subject: "Bahasa Indonesia", difficulty: "Pemula" }
  ];

  const recentScores = [
    {
      date: "2025-01-15",
      subject: "Bahasa Indonesia", 
      game: "Petualangan Literasi Nusantara",
      score: 85,
      maxScore: 100,
      notes: "Bagus! Pemahaman cerita sudah meningkat",
      badge: "Pembaca Aktif"
    },
    {
      date: "2025-01-12",
      subject: "Bahasa Indonesia",
      game: "Petualangan Literasi Nusantara", 
      score: 88,
      maxScore: 100,
      notes: "Sangat memahami karakterisasi dan alur cerita",
      badge: "Master Literasi"
    },
    {
      date: "2025-01-10",
      subject: "Bahasa Indonesia",
      game: "Petualangan Literasi Nusantara",
      score: 82,
      maxScore: 100,
      notes: "Baik! Perlu lebih fokus pada pemahaman makna tersirat",
      badge: null
    }
  ];

  const monthlyProgress = [
    { subject: "Bahasa Indonesia", avgScore: 85, progress: 85, trend: "up" }
  ];

  const recommendations = [
    {
      type: "suggestion",
      title: "Tingkatkan Kemampuan Literasi",
      description: "Dengan nilai yang bagus, cobalah level yang lebih menantang dalam game literasi",
      action: "Main Level Lanjutan Literasi",
      priority: "medium",
      icon: Lightbulb,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      type: "strength",
      title: "Pertahankan Kebiasaan Membaca",
      description: "Kemampuan literasi kamu berkembang pesat! Terus asah dengan membaca beragam teks",
      action: "Jelajahi Cerita Baru",
      priority: "high",
      icon: Star,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject || !selectedGame || !score) {
      alert("Mohon lengkapi semua field yang diperlukan!");
      return;
    }

    // Simulate saving score
    alert(`Nilai berhasil disimpan!\n\nMata Pelajaran: ${selectedSubject}\nGame: ${selectedGame}\nNilai: ${score}/100\nCatatan: ${notes || "Tidak ada catatan"}`);
    
    // Reset form
    setSelectedSubject("");
    setSelectedGame("");
    setScore("");
    setNotes("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-200";
    if (score >= 70) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-gray-500" />;
    }
  };

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
                <span className="text-xl text-gray-800">Input Nilai</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Target className="w-4 h-4 text-teal-500" />
              <span>Tracking Progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Input Nilai Kamu 📝
          </h1>
          <p className="text-lg text-gray-600">
            Catat progress belajar dan pencapaian kamu di setiap game edukasi
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PlusCircle className="w-6 h-6 text-teal-500" />
                  <span>Tambah Nilai Baru</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subject Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Mata Pelajaran</Label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20">
                          <SelectValue placeholder="Pilih mata pelajaran" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Game Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="game">Game Edukasi</Label>
                      <Select value={selectedGame} onValueChange={setSelectedGame}>
                        <SelectTrigger className="bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20">
                          <SelectValue placeholder="Pilih game" />
                        </SelectTrigger>
                        <SelectContent>
                          {games
                            .filter(game => !selectedSubject || game.subject === selectedSubject)
                            .map((game) => (
                            <SelectItem key={game.name} value={game.name}>
                              <div className="flex items-center justify-between w-full">
                                <span>{game.name}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {game.difficulty}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Score Input */}
                  <div className="space-y-2">
                    <Label htmlFor="score">Nilai (0-100)</Label>
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Masukkan nilai"
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      required
                    />
                    {score && (
                      <div className="flex items-center space-x-2">
                        <Progress value={parseInt(score)} className="flex-1 h-2" />
                        <span className={`text-sm font-medium ${getScoreColor(parseInt(score))}`}>
                          {score}/100
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Tambahkan catatan tentang pembelajaran..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Nilai
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Scores & Progress */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-0">
                <Tabs defaultValue="recent" className="w-full">
                  <div className="px-6 pt-6">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                      <TabsTrigger value="recent">Nilai Terbaru</TabsTrigger>
                      <TabsTrigger value="progress">Progress Bulanan</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="recent" className="px-6 pb-6">
                    <div className="space-y-4 mt-4">
                      {recentScores.map((record, index) => (
                        <div key={index} className={`p-4 rounded-lg border-2 ${getScoreBackground(record.score)}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900">{record.game}</h4>
                              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{record.subject}</span>
                                <span>•</span>
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(record.date).toLocaleDateString('id-ID')}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${getScoreColor(record.score)}`}>
                                {record.score}
                              </div>
                              <div className="text-sm text-gray-500">/{record.maxScore}</div>
                            </div>
                          </div>
                          
                          {record.notes && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Catatan:</span> {record.notes}
                            </p>
                          )}
                          
                          {record.badge && (
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4 text-yellow-500" />
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Badge: {record.badge}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="px-6 pb-6">
                    <div className="space-y-4 mt-4">
                      {monthlyProgress.map((subject, index) => (
                        <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <BookOpen className="w-5 h-5 text-teal-500" />
                              <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getTrendIcon(subject.trend)}
                              <span className={`text-lg font-bold ${getScoreColor(subject.avgScore)}`}>
                                {subject.avgScore}
                              </span>
                            </div>
                          </div>
                          <Progress value={subject.progress} className="h-3" />
                          <div className="flex justify-between text-sm text-gray-500 mt-1">
                            <span>Rata-rata bulan ini</span>
                            <span>{subject.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-blue-500 text-white">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Star className="w-12 h-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Progress Kamu</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-teal-100 text-sm">Game Selesai</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">85</div>
                    <div className="text-teal-100 text-sm">Rata-rata</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">7</div>
                    <div className="text-teal-100 text-sm">Badge</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">28</div>
                    <div className="text-teal-100 text-sm">Jam Belajar</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips Input Nilai</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Jujur dalam penilaian:</span> Input nilai sesuai hasil sesungguhnya untuk tracking yang akurat.
                  </p>
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="text-sm text-teal-800">
                    <span className="font-medium">Tambahkan catatan:</span> Catat kesulitan atau pencapaian khusus untuk referensi.
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Review berkala:</span> Lihat progress mingguan untuk evaluasi.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <span>Rekomendasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${rec.bgColor} ${rec.borderColor}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rec.bgColor} border ${rec.borderColor}`}>
                        <rec.icon className={`w-4 h-4 ${rec.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold text-sm ${rec.color} mb-1`}>
                          {rec.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {rec.description}
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className={`text-xs h-7 ${rec.color} border-current hover:bg-current hover:text-white`}
                        >
                          {rec.action}
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>


          </div>
        </div>
      </div>
    </div>
  );
}