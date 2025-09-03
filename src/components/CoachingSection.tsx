import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  User, 
  Users,
  Video,
  MessageCircle,
  BookOpen,
  Award,
  TrendingUp,
  Star,
  CheckCircle,
  PlayCircle,
  Phone,
  Mail,
  Globe,
  FileText,
  Target,
  Brain,
  Heart,
  Lightbulb,
  Eye,
  Plus,
  Settings
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CoachingSectionProps {
  userRole?: 'student' | 'teacher' | null;
}

export function CoachingSection({ userRole }: CoachingSectionProps) {
  const [selectedCoach, setSelectedCoach] = useState("dr-sari");
  const [selectedSession, setSelectedSession] = useState(null);

  const coaches = [
    {
      id: "dr-sari",
      name: "Dr. Sari Dewi Handayani, M.Pd",
      title: "Pakar Literasi & Pendidikan",
      specialization: "Literasi Dasar, Reading Comprehension",
      experience: "15+ tahun",
      rating: 4.9,
      sessions: 350,
      price: "Rp 150.000/sesi",
      languages: ["Bahasa Indonesia", "English"],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      availability: "Senin - Jumat, 09:00 - 17:00",
      description: "Spesialis dalam pengembangan kemampuan literasi dasar dengan pendekatan yang personal dan efektif"
    },
    {
      id: "prof-ahmad",
      name: "Prof. Ahmad Wijaya, Ph.D",
      title: "Profesor Sastra & Linguistik",
      specialization: "Sastra Indonesia, Advanced Writing",
      experience: "20+ tahun",
      rating: 4.8,
      sessions: 280,
      price: "Rp 200.000/sesi",
      languages: ["Bahasa Indonesia", "English", "Javanese"],
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      availability: "Selasa - Sabtu, 10:00 - 18:00",
      description: "Ahli sastra dengan pengalaman mengajar di universitas terkemuka, fokus pada pengembangan keterampilan menulis tingkat lanjut"
    },
    {
      id: "maya-putri",
      name: "Maya Putri Sari, S.Pd, M.A",
      title: "Creative Writing Coach",
      specialization: "Creative Writing, Storytelling",
      experience: "8+ tahun",
      rating: 4.7,
      sessions: 195,
      price: "Rp 120.000/sesi",
      languages: ["Bahasa Indonesia", "English"],
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b3bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      availability: "Senin - Jumat, 14:00 - 21:00",
      description: "Penulis dan coach kreatif yang berpengalaman dalam membimbing penulis pemula hingga mahir"
    }
  ];

  const sessions = [
    {
      id: 1,
      title: "Dasar-Dasar Literasi Efektif",
      coach: "Dr. Sari Dewi Handayani",
      type: "Individual",
      duration: "60 menit",
      date: "2025-01-05",
      time: "10:00 - 11:00",
      price: "Rp 150.000",
      description: "Sesi foundational untuk membangun kemampuan literasi yang kuat",
      topics: ["Reading Strategies", "Comprehension Techniques", "Note-taking Methods"],
      level: "Pemula"
    },
    {
      id: 2,
      title: "Workshop Menulis Kreatif",
      coach: "Maya Putri Sari",
      type: "Group (Max 8)",
      duration: "90 menit",
      date: "2025-01-07",
      time: "19:00 - 20:30",
      price: "Rp 80.000",
      description: "Workshop intensif untuk mengembangkan keterampilan menulis kreatif",
      topics: ["Character Development", "Plot Structure", "Creative Techniques"],
      level: "Menengah"
    },
    {
      id: 3,
      title: "Advanced Literary Analysis",
      coach: "Prof. Ahmad Wijaya",
      type: "Individual",
      duration: "75 menit",
      date: "2025-01-08",
      time: "15:00 - 16:15",
      price: "Rp 200.000",
      description: "Analisis mendalam karya sastra untuk pemahaman yang komprehensif",
      topics: ["Critical Analysis", "Literary Theory", "Academic Writing"],
      level: "Lanjutan"
    }
  ];

  const programs = [
    {
      id: 1,
      title: "Literacy Foundation Program",
      duration: "8 minggu",
      sessions: 16,
      type: "Individual + Group",
      price: "Rp 1.200.000",
      description: "Program komprehensif untuk membangun fondasi literasi yang kuat",
      features: ["Personal coaching", "Group discussions", "Progress tracking", "Certification"],
      level: "Pemula - Menengah"
    },
    {
      id: 2,
      title: "Creative Writing Mastery",
      duration: "12 minggu",
      sessions: 24,
      type: "Individual + Workshop",
      price: "Rp 1.800.000",
      description: "Program intensif untuk menguasai seni menulis kreatif",
      features: ["One-on-one mentoring", "Weekly workshops", "Portfolio development", "Publication guidance"],
      level: "Menengah - Lanjutan"
    },
    {
      id: 3,
      title: "Academic Excellence Package",
      duration: "6 bulan",
      sessions: 48,
      type: "Comprehensive",
      price: "Rp 3.500.000",
      description: "Program menyeluruh untuk excellensi akademik dalam bidang literasi",
      features: ["Multi-coach support", "Academic writing", "Research methods", "Thesis guidance"],
      level: "Lanjutan"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Andi Pratama",
      role: "Mahasiswa",
      rating: 5,
      text: "Coaching dengan Dr. Sari benar-benar mengubah cara saya memahami teks. Sekarang saya lebih percaya diri dalam analisis literatur.",
      date: "2024-12-15",
      program: "Literacy Foundation Program"
    },
    {
      id: 2,
      name: "Rini Handayani",
      role: "Guru",
      rating: 5,
      text: "Workshop menulis kreatif dengan Maya sangat inspiratif. Teknik-teknik yang diajarkan langsung bisa saya terapkan di kelas.",
      date: "2024-12-10",
      program: "Creative Writing Workshop"
    },
    {
      id: 3,
      name: "Budi Santoso",
      role: "Penulis Pemula",
      rating: 4,
      text: "Prof. Ahmad memberikan insight yang mendalam tentang sastra Indonesia. Sangat membantu untuk pengembangan karya saya.",
      date: "2024-12-08",
      program: "Advanced Literary Analysis"
    }
  ];

  const getStatsForRole = () => {
    if (userRole === 'teacher') {
      return [
        { icon: Users, label: 'Coach Tersedia', value: '12' },
        { icon: Calendar, label: 'Sesi Bulan Ini', value: '45' },
        { icon: Star, label: 'Rating Rata-rata', value: '4.8' },
        { icon: Award, label: 'Sertifikat Issued', value: '28' }
      ];
    }
    return [
      { icon: GraduationCap, label: 'Sesi Diikuti', value: '8' },
      { icon: Clock, label: 'Total Jam', value: '12' },
      { icon: Award, label: 'Sertifikat', value: '2' },
      { icon: TrendingUp, label: 'Progress', value: '85%' }
    ];
  };

  const stats = getStatsForRole();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Pemula": return "text-green-600 bg-green-50";
      case "Menengah": return "text-yellow-600 bg-yellow-50";
      case "Lanjutan": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4 flex items-center">
          <GraduationCap className="w-8 h-8 mr-3 text-primary" />
          SENA Coaching Clinic - Bimbingan Personal Literasi
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher'
            ? 'Kelola sesi coaching dan pantau perkembangan literasi siswa dengan bimbingan expert'
            : 'Tingkatkan kemampuan literasi Anda dengan bimbingan personal dari coach berpengalaman'
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

      <Tabs defaultValue="coaches" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="coaches">
            {userRole === 'teacher' ? 'Manage Coaches' : 'Pilih Coach'}
          </TabsTrigger>
          <TabsTrigger value="sessions">Sesi Coaching</TabsTrigger>
          <TabsTrigger value="programs">Program</TabsTrigger>
          <TabsTrigger value="testimonials">Testimoni</TabsTrigger>
        </TabsList>

        {/* Coaches Tab */}
        <TabsContent value="coaches" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map(coach => (
              <Card 
                key={coach.id} 
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  selectedCoach === coach.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedCoach(coach.id)}
              >
                <div className="aspect-square overflow-hidden rounded-t-lg relative">
                  <ImageWithFallback
                    src={coach.image}
                    alt={coach.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      {coach.rating}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{coach.name}</CardTitle>
                  <CardDescription>{coach.title}</CardDescription>
                  <div className="space-y-2">
                    <Badge variant="outline">{coach.specialization}</Badge>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center mb-1">
                        <Award className="w-4 h-4 mr-2" />
                        {coach.experience} pengalaman
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {coach.sessions} sesi coaching
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {coach.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-primary">{coach.price}</div>
                      <div className="text-xs text-muted-foreground">per sesi</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {coach.availability}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Session
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {userRole === 'teacher' ? 'Kelola Sesi' : 'Sesi Tersedia'}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Filter Tanggal
                </Button>
                {userRole === 'teacher' && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Sesi
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid gap-4">
              {sessions.map(session => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          <Video className="w-5 h-5 mr-2" />
                          {session.title}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Coach: {session.coach}
                        </CardDescription>
                      </div>
                      <Badge className={getLevelColor(session.level)}>
                        {session.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(session.date).toLocaleDateString('id-ID')}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {session.time} ({session.duration})
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {session.type}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-semibold text-primary">{session.price}</div>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-xs font-medium mb-2">Topik yang akan dibahas:</div>
                      <div className="flex flex-wrap gap-1">
                        {session.topics.map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {userRole === 'teacher' ? 'Kelola Sesi' : 'Daftar Sekarang'}
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Program Coaching Jangka Panjang</h2>
              <p className="text-muted-foreground mb-6">
                Program terstruktur untuk pengembangan kemampuan literasi secara komprehensif
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map(program => (
                <Card key={program.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center">
                          <Award className="w-5 h-5 mr-2 text-purple-600" />
                          {program.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{program.description}</CardDescription>
                      </div>
                      <Badge className={getLevelColor(program.level)}>
                        {program.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {program.duration}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Video className="w-4 h-4 mr-2" />
                          {program.sessions} sesi
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2" />
                          {program.type}
                        </div>
                        <div className="font-semibold text-primary">
                          {program.price}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium mb-2">Fitur Program:</div>
                        <div className="space-y-1">
                          {program.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-xs text-muted-foreground">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Daftar Program
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="mt-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Testimoni Peserta</h2>
              <p className="text-muted-foreground mb-6">
                Dengarkan pengalaman peserta coaching clinic SENA yang telah merasakan manfaatnya
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map(testimonial => (
                <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                      <div className="flex items-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{testimonial.program}</span>
                        <span>{new Date(testimonial.date).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="text-center p-8">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Siap Memulai Journey Literasi Anda?</h3>
                <p className="text-muted-foreground mb-6">
                  Bergabunglah dengan ribuan peserta yang telah merasakan transformasi kemampuan literasi mereka
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Konsultasi Gratis
                  </Button>
                  <Button variant="outline" size="lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Lihat Jadwal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}