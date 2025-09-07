import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  ArrowLeft, 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Calendar,
  BookOpen,
  Target
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface ManageClassPageProps {
  user: {
    type: 'student' | 'teacher';
    email: string;
    name?: string;
  };
  onBack: () => void;
}

export function ManageClassPage({ user, onBack }: ManageClassPageProps) {
  const [selectedClass, setSelectedClass] = useState("4A");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data for classes
  const classes = [
    { id: "4A", name: "Kelas 4A", students: 28, subject: "Bahasa Indonesia" },
    { id: "4B", name: "Kelas 4B", students: 30, subject: "Bahasa Indonesia" },
    { id: "5A", name: "Kelas 5A", students: 25, subject: "Bahasa Indonesia" },
    { id: "5B", name: "Kelas 5B", students: 29, subject: "Bahasa Indonesia" }
  ];

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Andi Pratama",
      class: "4A",
      email: "andi.pratama@student.com",
      lastActivity: "2 jam lalu",
      totalGames: 12,
      avgScore: 85,
      status: "active",
      badges: ["Pembaca Aktif", "Explorer"],
      weeklyProgress: [78, 82, 85, 88, 85, 89, 85],
      literacyLevel: "Cakap"
    },
    {
      id: 2,
      name: "Sari Dewi",
      class: "4A", 
      email: "sari.dewi@student.com",
      lastActivity: "1 hari lalu",
      totalGames: 8,
      avgScore: 72,
      status: "warning",
      badges: ["Pemula"],
      weeklyProgress: [65, 68, 72, 70, 74, 72, 72],
      literacyLevel: "Dasar"
    },
    {
      id: 3,
      name: "Budi Santoso",
      class: "4A",
      email: "budi.santoso@student.com", 
      lastActivity: "3 hari lalu",
      totalGames: 15,
      avgScore: 91,
      status: "excellent",
      badges: ["Master Literasi", "Pembaca Aktif", "Achiever"],
      weeklyProgress: [88, 89, 91, 90, 92, 91, 91],
      literacyLevel: "Mahir"
    },
    {
      id: 4,
      name: "Nina Sari",
      class: "4A",
      email: "nina.sari@student.com",
      lastActivity: "5 hari lalu",
      totalGames: 4,
      avgScore: 58,
      status: "inactive",
      badges: [],
      weeklyProgress: [55, 58, 56, 60, 58, 57, 58],
      literacyLevel: "Dasar Intervensi"
    }
  ];

  const classStats = [
    { name: "Jan", avgScore: 75 },
    { name: "Feb", avgScore: 78 },
    { name: "Mar", avgScore: 82 },
    { name: "Apr", avgScore: 85 },
    { name: "Mei", avgScore: 83 },
    { name: "Jun", avgScore: 87 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100 border-green-200';
      case 'active': return 'text-teal-600 bg-teal-100 border-teal-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'inactive': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active': return <CheckCircle className="w-4 h-4 text-teal-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'inactive': return <Clock className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <TrendingUp className="w-4 h-4 text-gray-500" />;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || student.status === filterStatus;
    const matchesClass = student.class === selectedClass;
    return matchesSearch && matchesFilter && matchesClass;
  });

  const selectedClassData = classes.find(c => c.id === selectedClass);

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
                <span className="text-xl text-gray-800">Kelola Kelas</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4 text-teal-500" />
              <span>Manajemen Siswa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kelola Kelas 👨‍🏫
          </h1>
          <p className="text-lg text-gray-600">
            Pantau progress dan kelola siswa di kelas Anda
          </p>
        </div>

        {/* Class Selector and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Total Kelas</h3>
                  <p className="text-3xl font-bold">{classes.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Total Siswa</h3>
                  <p className="text-3xl font-bold">{classes.reduce((sum, cls) => sum + cls.students, 0)}</p>
                </div>
                <Target className="w-8 h-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Rata-rata Kelas</h3>
                  <p className="text-3xl font-bold">81</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Siswa Aktif</h3>
                  <p className="text-3xl font-bold">89%</p>
                </div>
                <Award className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Progress Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <span>Progress Kelas Bulanan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={classStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgScore" stroke="#14b8a6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Student Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-6 h-6 text-teal-500" />
                    <span>Daftar Siswa</span>
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-teal-500 hover:bg-teal-600">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Tambah Siswa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Tambah Siswa Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="studentName">Nama Siswa</Label>
                          <Input id="studentName" placeholder="Masukkan nama siswa" />
                        </div>
                        <div>
                          <Label htmlFor="studentEmail">Email</Label>
                          <Input id="studentEmail" type="email" placeholder="Masukkan email siswa" />
                        </div>
                        <div>
                          <Label htmlFor="studentClass">Kelas</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-teal-500 hover:bg-teal-600">
                          Tambah Siswa
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
                        placeholder="Cari siswa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Student List */}
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className={`p-4 rounded-lg border-2 ${getStatusColor(student.status)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{student.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {student.class}
                            </Badge>
                            {getStatusIcon(student.status)}
                            <Badge className={`text-xs ${student.literacyLevel === 'Mahir' ? 'bg-green-100 text-green-800' : 
                              student.literacyLevel === 'Cakap' ? 'bg-teal-100 text-teal-800' :
                              student.literacyLevel === 'Dasar' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                              {student.literacyLevel}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span>{student.email}</span> • <span>Terakhir aktif: {student.lastActivity}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Games: {student.totalGames}</span>
                            <span>Rata-rata: {student.avgScore}</span>
                            {student.badges.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Award className="w-4 h-4 text-yellow-500" />
                                <span>{student.badges.length} badges</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {student.avgScore}
                          </div>
                          <div className="text-sm text-gray-500">/100</div>
                          <div className="flex items-center mt-1">
                            {getTrendIcon(student.weeklyProgress[6], student.weeklyProgress[5])}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Progress minggu ini</span>
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Lihat Detail
                        </Button>
                      </div>
                      
                      {/* Mini progress chart */}
                      <div className="mt-3 h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={student.weeklyProgress.map((score, index) => ({ day: index + 1, score }))}>
                            <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Tidak ada siswa yang ditemukan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Class Info */}
            {selectedClassData && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">{selectedClassData.name}</h3>
                    <p className="text-orange-100 mb-4">{selectedClassData.subject}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{selectedClassData.students}</div>
                        <div className="text-orange-100 text-sm">Total Siswa</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{filteredStudents.filter(s => s.status === 'active' || s.status === 'excellent').length}</div>
                        <div className="text-orange-100 text-sm">Aktif</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">🚀 Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Jadwalkan Game
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Buat Tugas Baru
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="w-4 h-4 mr-2" />
                  Berikan Badge
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Export Data Kelas
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">🏆 Pencapaian Terbaru</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Budi Santoso mendapat badge "Master Literasi"</p>
                    <p className="text-xs text-gray-500">2 jam lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Andi Pratama menyelesaikan level 5</p>
                    <p className="text-xs text-gray-500">1 hari lalu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Kelas 4A mencapai rata-rata 85</p>
                    <p className="text-xs text-gray-500">3 hari lalu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}