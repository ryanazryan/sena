import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { BookOpen, Play, PenTool, User, Calendar, MapPin, Phone, Mail, Trophy, Star, Target, Users, TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface DashboardPageProps {
  user: {
    type: 'student' | 'teacher';
    email: string;
    name?: string;
  };
  onLogout: () => void;
  onNavigateToGames?: () => void;
  onNavigateToGuide?: () => void;
  onNavigateToInputScores?: () => void;
  onNavigateToManageClass?: () => void;
  onNavigateToManageGames?: () => void;
}

export function DashboardPage({ user, onLogout, onNavigateToGames, onNavigateToGuide, onNavigateToInputScores, onNavigateToManageClass, onNavigateToManageGames }: DashboardPageProps) {
  // Mock user data based on user type
  const userData = user.type === 'student' ? {
    name: user.name || "Muhammad Sahroni", 
    birthDate: "24 September 2001",
    gender: "Laki-laki",
    grade: "Kelas 6",
    school: "SMK Nusantara",
    phone: "081234567890",
    email: user.email
  } : {
    name: user.name || "Ahmad Wijaya, S.Pd",
    nip: "196803141989031007",
    subject: "Matematika", 
    school: "SDN 1 Malang",
    phone: "081234567890",
    email: user.email
  };

  // Mock ability data for students
  const abilityData = [
    { name: 'Membaca', value: 40, color: '#f59e0b' },
    { name: 'Menulis', value: 35, color: '#ef4444' },
    { name: 'Berbicara', value: 25, color: '#10b981' }
  ];

  // Mock literacy levels
  const literacyLevels = [
    { level: "Dasar Intervensi", color: "bg-red-500", description: "Perlu bimbingan intensif", progress: 20 },
    { level: "Dasar", color: "bg-orange-500", description: "Kemampuan dasar tercapai", progress: 45 },
    { level: "Cakap", color: "bg-teal-500", description: "Kemampuan baik", progress: 70 },
    { level: "Mahir", color: "bg-green-500", description: "Kemampuan sangat baik", progress: 85 }
  ];

  // Mock data for teacher dashboard
  const studentReviews = [
    {
      studentName: "Andi Pratama",
      class: "5A",
      subject: "Bahasa Indonesia",
      lastActivity: "2 jam lalu",
      score: 85,
      status: "good",
      game: "Petualangan Literasi Nusantara",
      notes: "Progress sangat baik dalam pemahaman cerita"
    },
    {
      studentName: "Sari Dewi", 
      class: "4B",
      subject: "Bahasa Indonesia",
      lastActivity: "1 hari lalu",
      score: 72,
      status: "warning",
      game: "Petualangan Literasi Nusantara",
      notes: "Perlu latihan lebih dalam memahami makna tersirat"
    },
    {
      studentName: "Budi Santoso",
      class: "6A", 
      subject: "Bahasa Indonesia",
      lastActivity: "3 hari lalu",
      score: 91,
      status: "excellent",
      game: "Petualangan Literasi Nusantara",
      notes: "Kemampuan literasi sangat memuaskan"
    }
  ];

  const classProgress = [
    { className: "4A", students: 28, avgScore: 78, completed: 24 },
    { className: "4B", students: 30, avgScore: 82, completed: 27 },
    { className: "5A", students: 25, avgScore: 75, completed: 21 },
    { className: "5B", students: 29, avgScore: 80, completed: 25 }
  ];

  const teacherRecommendations = [
    {
      type: "urgent",
      title: "Perhatikan Siswa Berkemampuan Rendah",
      description: "3 siswa memerlukan bimbingan intensif dalam literasi",
      action: "Lihat Detail Siswa",
      priority: "high",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      type: "suggestion",
      title: "Tingkatkan Engagement Kelas",
      description: "Rata-rata waktu bermain menurun minggu ini",
      action: "Tinjau Strategi",
      priority: "medium",
      icon: TrendingUp,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      type: "positive",
      title: "Kelas 4B Menunjukkan Progress Baik",
      description: "Rata-rata nilai meningkat 15% bulan ini",
      action: "Berikan Apresiasi",
      priority: "low",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 border-green-200';
      case 'good': return 'text-teal-600 bg-teal-100 border-teal-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'danger': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'good': return <CheckCircle className="w-4 h-4 text-teal-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'danger': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-xl shadow-lg">
                <span className="text-2xl font-bold">SENA</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl text-gray-800">
                  Selamat datang, <span className="font-semibold text-teal-600">{userData.name}</span>
                </h1>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="border-teal-500 text-teal-600 hover:bg-teal-50"
            >
              Keluar
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-4">{userData.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {user.type === 'student' ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>Tanggal Lahir: {(userData as any).birthDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Jenis Kelamin: {(userData as any).gender}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Kelas: {(userData as any).grade}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Asal Sekolah: {userData.school}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>NIP: {(userData as any).nip}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Mata Pelajaran: {(userData as any).subject}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Sekolah: {userData.school}</span>
                          </div>
                        </>
                      )}
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>Nomor Telepon: {userData.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 md:col-span-1">
                        <Mail className="w-4 h-4" />
                        <span>Email: {userData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ability Chart - Only for Students */}
            {user.type === 'student' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-teal-500" />
                    <span>Kemampuan Saat Ini</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={abilityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {abilityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {abilityData.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm font-medium text-gray-700">{item.name}</span>
                              <span className="text-sm text-gray-600">{item.value}%</span>
                            </div>
                            <Progress value={item.value} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Literacy Levels - Only for Students */}
            {user.type === 'student' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
                    <Target className="w-6 h-6 text-blue-500" />
                    <span>Level Kemampuan Literasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {literacyLevels.map((level, index) => (
                      <Card key={index} className={`${level.color} text-white border-0`}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{level.level}</h3>
                          <p className="text-sm text-white/90 mb-3">{level.description}</p>
                          <div className="text-xs text-white/80">
                            Progress: {level.progress}%
                          </div>
                          <Progress value={level.progress} className="mt-2 h-1" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Student Reviews - Only for Teachers */}
            {user.type === 'teacher' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
                    <Users className="w-6 h-6 text-teal-500" />
                    <span>Review Siswa Terbaru</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {studentReviews.map((review, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(review.status)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{review.studentName}</h4>
                            <Badge variant="outline" className="text-xs">
                              {review.class}
                            </Badge>
                            {getStatusIcon(review.status)}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{review.game}</span> • {review.lastActivity}
                          </div>
                          <p className="text-sm text-gray-700">{review.notes}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {review.score}
                          </div>
                          <div className="text-sm text-gray-500">/100</div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{review.subject}</span>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Lihat Detail
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center pt-2">
                    <Button variant="outline" className="text-sm">
                      Lihat Semua Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Class Progress Chart - Only for Teachers */}
            {user.type === 'teacher' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 flex items-center space-x-2">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                    <span>Progress Kelas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="className" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="avgScore" fill="#14b8a6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {classProgress.map((classData, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Kelas {classData.className}</span>
                            <span className="text-sm text-gray-600">{classData.students} siswa</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Rata-rata: {classData.avgScore}</span>
                            <span className="text-sm text-gray-600">Selesai: {classData.completed}</span>
                          </div>
                          <Progress value={(classData.completed / classData.students) * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.type === 'student' ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Menyelesaikan game "Petualangan Literasi"</p>
                        <p className="text-xs text-gray-500">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Meraih badge "Pembaca Aktif"</p>
                        <p className="text-xs text-gray-500">1 hari yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Membaca materi "Cerita Rakyat Nusantara"</p>
                        <p className="text-xs text-gray-500">3 hari lalu</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Budi Santoso menyelesaikan Level 5 Literasi</p>
                        <p className="text-xs text-gray-500">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sari Dewi perlu perhatian khusus</p>
                        <p className="text-xs text-gray-500">1 hari yang lalu</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Kelas 4A mencapai rata-rata 85</p>
                        <p className="text-xs text-gray-500">3 hari yang lalu</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action Cards */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.type === 'teacher' ? 'Kelola Permainan' : 'Mulai Permainan'}</h3>
                    <p className="text-teal-100 text-sm">{user.type === 'teacher' ? 'Kelola game untuk siswa' : 'Jelajahi game edukasi'}</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-white text-teal-600 hover:bg-gray-100"
                  onClick={user.type === 'teacher' ? onNavigateToManageGames : onNavigateToGames}
                >
                  {user.type === 'teacher' ? 'Kelola Games' : 'Mulai Sekarang'}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Buku Panduan</h3>
                    <p className="text-orange-100 text-sm">Pelajari cara bermain</p>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 bg-white text-orange-600 hover:bg-gray-100"
                  onClick={onNavigateToGuide}
                >
                  Baca Panduan
                </Button>
              </CardContent>
            </Card>

            {user.type === 'student' && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <PenTool className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Input Nilai Kamu</h3>
                      <p className="text-blue-100 text-sm">Catat progress belajar</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100"
                    onClick={onNavigateToInputScores}
                  >
                    Input Nilai
                  </Button>
                </CardContent>
              </Card>
            )}

            {user.type === 'teacher' && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Kelola Kelas</h3>
                      <p className="text-purple-100 text-sm">Pantau progress siswa</p>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-white text-purple-600 hover:bg-gray-100"
                    onClick={onNavigateToManageClass}
                  >
                    Kelola Siswa
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Teacher Recommendations - Only for Teachers */}
            {user.type === 'teacher' && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>Rekomendasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teacherRecommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${rec.bgColor} ${rec.borderColor}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rec.bgColor} border ${rec.borderColor}`}>
                          <rec.icon className={`w-4 h-4 ${rec.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold text-sm ${rec.color} mb-1`} >
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
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2025 SENA Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}