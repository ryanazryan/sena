import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  GraduationCap, 
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
  Edit
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SenaSectionProps {
  userRole?: 'student' | 'teacher' | null;
}

export function SenaSection({ userRole }: SenaSectionProps) {
  const [selectedClass, setSelectedClass] = useState("bahasa-indonesia");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<typeof assignments[0] | null>(null);

  const classes = [
    {
      id: "bahasa-indonesia",
      name: "Bahasa Indonesia",
      teacher: "Ibu Sari Dewi",
      students: 28,
      progress: 75,
      color: "bg-blue-500",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Pembelajaran literasi bahasa Indonesia tingkat menengah"
    },
    {
      id: "sastra",
      name: "Sastra Indonesia",
      teacher: "Bapak Ahmad Wijaya",
      students: 24,
      progress: 60,
      color: "bg-green-500",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Apresiasi dan analisis karya sastra Indonesia"
    },
    {
      id: "menulis-kreatif",
      name: "Menulis Kreatif",
      teacher: "Ibu Maya Putri",
      students: 20,
      progress: 85,
      color: "bg-purple-500",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Pengembangan keterampilan menulis kreatif dan imajinatif"
    }
  ];

  const assignments = [
    {
      id: 1,
      title: "Analisis Cerpen Laskar Pelangi",
      subject: "bahasa-indonesia",
      dueDate: "2025-01-05",
      status: "pending",
      type: "essay",
      maxScore: 100,
      currentScore: null,
      description: "Analisis struktur dan tema dalam cerpen Laskar Pelangi dengan minimal 500 kata",
      submitted: false,
      aiGraded: false
    },
    {
      id: 2,
      title: "Puisi Bertema Alam",
      subject: "sastra",
      dueDate: "2025-01-03",
      status: "graded",
      type: "creative",
      maxScore: 100,
      currentScore: 88,
      description: "Buat puisi original dengan tema alam minimal 4 bait",
      submitted: true,
      aiGraded: true,
      feedback: "Karya yang bagus! Penggunaan majas dan diksi sudah tepat. Perhatikan ritme dan rima untuk karya selanjutnya."
    },
    {
      id: 3,
      title: "Resensi Buku Pilihan",
      subject: "bahasa-indonesia",
      dueDate: "2025-01-10",
      status: "draft",
      type: "review",
      maxScore: 100,
      currentScore: null,
      description: "Buat resensi buku fiksi atau non-fiksi pilihan Anda",
      submitted: false,
      aiGraded: false
    },
    {
      id: 4,
      title: "Cerpen Pendek",
      subject: "menulis-kreatif",
      dueDate: "2025-01-08",
      status: "pending",
      type: "creative",
      maxScore: 100,
      currentScore: null,
      description: "Tulis cerpen pendek maksimal 1000 kata dengan tema bebas",
      submitted: false,
      aiGraded: false
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "graded": return "text-green-600 bg-green-50";
      case "pending": return "text-orange-600 bg-orange-50";
      case "draft": return "text-blue-600 bg-blue-50";
      case "overdue": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "graded": return "Sudah Dinilai";
      case "pending": return "Menunggu Penilaian";
      case "draft": return "Draft";
      case "overdue": return "Terlambat";
      default: return "Unknown";
    }
  };

  const currentClass = classes.find(c => c.id === selectedClass);
  const classAssignments = assignments.filter(a => a.subject === selectedClass);

  const getStatsForRole = () => {
    if (userRole === 'teacher') {
      return [
        { icon: BookOpen, label: 'Kelas Aktif', value: '8' },
        { icon: FileText, label: 'Tugas Dibuat', value: '24' },
        { icon: CheckCircle, label: 'Tugas Dinilai', value: '186' },
        { icon: TrendingUp, label: 'Rata-rata Kelas', value: '85' }
      ];
    }
    return [
      { icon: BookOpen, label: 'Kelas Aktif', value: '3' },
      { icon: FileText, label: 'Tugas Total', value: '12' },
      { icon: CheckCircle, label: 'Tugas Selesai', value: '8' },
      { icon: TrendingUp, label: 'Rata-rata Nilai', value: '85' }
    ];
  };

  const stats = getStatsForRole();

  const SubmitAssignmentForm = ({ assignment }: { assignment: any }) => (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Submit Tugas: {assignment.title}
        </CardTitle>
        <CardDescription>{assignment.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Upload File Tugas</label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Klik untuk upload atau drag & drop file
            </p>
            <p className="text-xs text-muted-foreground">
              Format: PDF, DOC, DOCX (Max 10MB)
            </p>
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Catatan Tambahan (Opsional)</label>
          <Textarea 
            placeholder="Tambahkan catatan atau penjelasan tentang tugas Anda..."
            className="min-h-[100px]"
          />
        </div>
        
        <div className="flex gap-3">
          <Button className="flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Submit Tugas
          </Button>
          <Button variant="outline" onClick={() => setShowSubmitForm(false)}>
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const AIGradingCard = ({ assignment }: { assignment: any }) => (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center text-green-800">
          <Brain className="w-5 h-5 mr-2" />
          Penilaian AI SENA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-800">{assignment.currentScore}/100</span>
          <Badge className="bg-green-600">
            <Star className="w-3 h-3 mr-1" />
            AI Graded
          </Badge>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Konten & Struktur</span>
              <span>90/100</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Tata Bahasa</span>
              <span>85/100</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Kreativitas</span>
              <span>90/100</span>
            </div>
            <Progress value={90} className="h-2" />
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm font-medium mb-2">Feedback AI SENA:</p>
          <p className="text-sm text-gray-700">{assignment.feedback}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <GraduationCap className="w-8 h-8 mr-3 text-primary" />
          SENA Platform - Self-Learning Education for New Adventure
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher'
            ? 'Platform manajemen kelas dengan penilaian AI dan tracking progress siswa yang terintegrasi'
            : 'Platform pembelajaran mandiri dengan penilaian AI dan manajemen tugas yang terintegrasi'
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

      <Tabs defaultValue="classes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes">
            {userRole === 'teacher' ? 'Kelas Saya' : 'Kelas Saya'}
          </TabsTrigger>
          <TabsTrigger value="assignments">
            {userRole === 'teacher' ? 'Kelola Tugas' : 'Tugas'}
          </TabsTrigger>
          <TabsTrigger value="grades">
            {userRole === 'teacher' ? 'Nilai Siswa' : 'Nilai & Progress'}
          </TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent value="classes" className="mt-6">
          {userRole === 'teacher' && (
            <div className="mb-6">
              <Button className="mb-4">
                <Plus className="w-4 h-4 mr-2" />
                Buat Kelas Baru
              </Button>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(classItem => (
              <Card 
                key={classItem.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedClass === classItem.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedClass(classItem.id)}
              >
                <div className="aspect-video overflow-hidden rounded-t-lg relative">
                  <ImageWithFallback
                    src={classItem.image}
                    alt={classItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${classItem.color}`}></div>
                  {userRole === 'teacher' && (
                    <div className="absolute top-2 left-2">
                      <Button size="sm" variant="secondary">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {classItem.name}
                    <Badge variant="outline">{classItem.students} siswa</Badge>
                  </CardTitle>
                  <CardDescription>{classItem.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      {userRole === 'teacher' ? 'Anda mengajar' : classItem.teacher}
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{classItem.progress}%</span>
                      </div>
                      <Progress value={classItem.progress} />
                    </div>
                    <Button className="w-full" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      {userRole === 'teacher' ? 'Kelola Kelas' : 'Lihat Detail'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-6">
          {showSubmitForm && selectedAssignment ? (
            <div className="mb-6">
              <SubmitAssignmentForm assignment={selectedAssignment} />
            </div>
          ) : null}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {userRole === 'teacher' ? 'Kelola Tugas' : 'Daftar Tugas'}
              </h2>
              <div className="flex gap-2">
                {userRole === 'teacher' && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Tugas Baru
                  </Button>
                )}
                {classes.map(cls => (
                  <Button
                    key={cls.id}
                    variant={selectedClass === cls.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    {cls.name}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="grid gap-4">
              {classAssignments.map(assignment => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          <FileText className="w-5 h-5 mr-2" />
                          {assignment.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{assignment.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {getStatusText(assignment.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        Deadline: {new Date(assignment.dueDate).toLocaleDateString('id-ID')}
                      </div>
                      {assignment.currentScore && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="font-semibold">{assignment.currentScore}/{assignment.maxScore}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {userRole === 'teacher' ? (
                        <>
                          <Button className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Lihat Submission
                          </Button>
                          <Button variant="outline">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Tugas
                          </Button>
                        </>
                      ) : (
                        <>
                          {!assignment.submitted ? (
                            <Button 
                              className="flex-1"
                              onClick={() => {
                                setSelectedAssignment(assignment);
                                setShowSubmitForm(true);
                              }}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Submit Tugas
                            </Button>
                          ) : (
                            <Button variant="outline" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Download Submission
                            </Button>
                          )}
                          <Button variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">
                {userRole === 'teacher' ? 'Penilaian AI SENA & Feedback' : 'Nilai & Feedback AI SENA'}
              </h2>
              {assignments.filter(a => a.status === 'graded').map(assignment => (
                <div key={assignment.id}>
                  <AIGradingCard assignment={assignment} />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    {userRole === 'teacher' ? 'Prestasi Kelas' : 'Pencapaian SENA'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm">
                      {userRole === 'teacher' ? 'SENA Best Teacher Award' : 'First SENA Assignment'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm">
                      {userRole === 'teacher' ? '100% Completion Rate' : 'SENA Perfect Score'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm">
                      {userRole === 'teacher' ? 'AI Integration Expert' : 'Creative Writer'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>
                    {userRole === 'teacher' ? 'Overview Kelas' : 'Progress Overview'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {classes.map(cls => (
                      <div key={cls.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cls.name}</span>
                          <span>{cls.progress}%</span>
                        </div>
                        <Progress value={cls.progress} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}