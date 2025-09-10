import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Lightbulb, 
  BookOpen, 
  Clock, 
  User, 
  Heart, 
  Eye, 
  Brain,
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Video,
  FileText
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TipsSectionProps {
  userRole?: 'student' | 'teacher' | null;
}

export function TipsSection({ userRole }: TipsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("reading");

  const categories = [
    { id: "reading", name: "Membaca", icon: BookOpen, color: "text-blue-600" },
    { id: "writing", name: "Menulis", icon: FileText, color: "text-green-600" },
    { id: "vocabulary", name: "Kosakata", icon: Brain, color: "text-purple-600" },
    { id: "comprehension", name: "Pemahaman", icon: Target, color: "text-orange-600" }
  ];

  const tips = [
    {
      id: 1,
      title: userRole === 'teacher' ? "Mengajar Teknik Skimming dan Scanning" : "Teknik Skimming dan Scanning",
      category: "reading",
      difficulty: "beginner",
      readTime: "5 menit",
      author: "Dr. Sarah Wijaya",
      likes: 245,
      description: userRole === 'teacher' 
        ? "Strategi mengajar teknik membaca cepat untuk siswa mencari informasi spesifik dan memahami inti bacaan."
        : "Pelajari cara membaca cepat untuk mencari informasi spesifik dan memahami inti bacaan dengan efektif.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true,
      steps: userRole === 'teacher' 
        ? [
            "Jelaskan perbedaan skimming dan scanning",
            "Demo teknik dengan teks contoh",
            "Berikan latihan terbimbing",
            "Assess pemahaman siswa",
            "Berikan feedback konstruktif"
          ]
        : [
            "Baca judul dan subjudul terlebih dahulu",
            "Perhatikan kata kunci dan frasa penting",
            "Fokus pada paragraf pertama dan terakhir",
            "Gunakan jari sebagai panduan mata",
            "Latih secara konsisten setiap hari"
          ],
      type: "article"
    },
    {
      id: 2,
      title: userRole === 'teacher' ? "Panduan Mengajar Menulis Paragraf" : "Menulis Paragraf yang Efektif",
      category: "writing",
      difficulty: "intermediate",
      readTime: "8 menit",
      author: "Prof. Ahmad Kusuma",
      likes: 189,
      description: userRole === 'teacher'
        ? "Metode mengajar siswa menyusun paragraf yang koheren dengan ide utama yang jelas."
        : "Cara menyusun paragraf yang koheren dengan ide utama yang jelas dan detail pendukung yang relevan.",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false,
      steps: userRole === 'teacher'
        ? [
            "Ajarkan konsep satu ide per paragraf",
            "Latih membuat kalimat topik",
            "Bimbing pengembangan detail",
            "Ajarkan penggunaan transisi",
            "Evaluasi hasil tulisan siswa"
          ]
        : [
            "Tentukan satu ide utama per paragraf",
            "Mulai dengan kalimat topik yang kuat",
            "Berikan detail dan contoh pendukung",
            "Gunakan transisi yang smooth",
            "Akhiri dengan kesimpulan mini"
          ],
      type: "article"
    },
    {
      id: 3,
      title: userRole === 'teacher' ? "Strategi Mengembangkan Kosakata Siswa" : "Memperkaya Kosakata Harian",
      category: "vocabulary",
      difficulty: "beginner",
      readTime: "6 menit",
      author: "Dra. Lisa Sari",
      likes: 312,
      description: userRole === 'teacher'
        ? "Teknik efektif membantu siswa menambah kosakata dan mengingat kata-kata baru dalam jangka panjang."
        : "Strategi praktis untuk menambah kosakata secara konsisten dan mengingat kata-kata baru dalam jangka panjang.",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true,
      steps: userRole === 'teacher'
        ? [
            "Buat program reading 15 menit",
            "Ajarkan teknik mencatat kata baru",
            "Implementasi flashcard digital",
            "Encourage conversation practice",
            "Schedule weekly vocabulary review"
          ]
        : [
            "Baca 15 menit setiap hari",
            "Catat kata baru dalam jurnal",
            "Gunakan aplikasi flashcard",
            "Praktikkan dalam percakapan",
            "Review mingguan kata-kata lama"
          ],
      type: "video"
    },
    {
      id: 4,
      title: userRole === 'teacher' ? "Meningkatkan Kemampuan Pemahaman Siswa" : "Meningkatkan Daya Ingat Bacaan",
      category: "comprehension",
      difficulty: "intermediate",
      readTime: "10 menit",
      author: "Dr. Budi Santoso",
      likes: 156,
      description: userRole === 'teacher'
        ? "Metode mengajar yang terbukti meningkatkan kemampuan siswa mengingat dan memahami isi bacaan."
        : "Teknik-teknik terbukti untuk meningkatkan kemampuan mengingat dan memahami isi bacaan dengan lebih baik.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false,
      steps: userRole === 'teacher'
        ? [
            "Ajarkan pre-reading questions",
            "Guide visualization techniques",
            "Facilitate group discussions",
            "Assign real-world applications",
            "Assess comprehension regularly"
          ]
        : [
            "Buat pertanyaan sebelum membaca",
            "Visualisasikan informasi penting",
            "Buat ringkasan dengan kata sendiri",
            "Diskusikan dengan orang lain",
            "Terapkan dalam kehidupan nyata"
          ],
      type: "article"
    },
    {
      id: 5,
      title: userRole === 'teacher' ? "Mengajar Mind Mapping untuk Reading" : "Teknik Mind Mapping untuk Membaca",
      category: "comprehension",
      difficulty: "advanced",
      readTime: "12 menit",
      author: "Prof. Maya Indira",
      likes: 278,
      description: userRole === 'teacher'
        ? "Panduan mengajar siswa menggunakan mind mapping untuk memahami struktur teks kompleks."
        : "Gunakan mind mapping untuk memahami struktur teks kompleks dan mengorganisir informasi secara visual.",
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f79e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true,
      steps: userRole === 'teacher'
        ? [
            "Demo mind map creation",
            "Teach branching techniques",
            "Show color and symbol usage",
            "Guide connection making",
            "Review and refine together"
          ]
        : [
            "Identifikasi tema utama di tengah",
            "Buat cabang untuk subtopik",
            "Gunakan warna dan simbol",
            "Hubungkan ide-ide terkait",
            "Review dan perbaiki peta"
          ],
      type: "video"
    },
    {
      id: 6,
      title: userRole === 'teacher' ? "Mengajar Struktur 5W+1H dalam Menulis" : "Menulis dengan Struktur 5W+1H",
      category: "writing",
      difficulty: "beginner",
      readTime: "7 menit",
      author: "Drs. Andi Prasetyo",
      likes: 203,
      description: userRole === 'teacher'
        ? "Framework mengajar siswa menulis yang lengkap dan informatif menggunakan pertanyaan 5W+1H."
        : "Framework dasar untuk menulis yang lengkap dan informatif menggunakan pertanyaan What, Who, When, Where, Why, dan How.",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false,
      steps: userRole === 'teacher'
        ? [
            "Explain What: Apa yang terjadi?",
            "Teach Who: Siapa yang terlibat?",
            "Show When: Kapan terjadinya?",
            "Guide Where: Di mana lokasinya?",
            "Discuss Why: Mengapa hal itu terjadi?",
            "Demonstrate How: Bagaimana prosesnya?"
          ]
        : [
            "What: Apa yang terjadi?",
            "Who: Siapa yang terlibat?",
            "When: Kapan terjadinya?",
            "Where: Di mana lokasinya?",
            "Why: Mengapa hal itu terjadi?",
            "How: Bagaimana prosesnya?"
          ],
      type: "article"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-50";
      case "intermediate": return "text-orange-600 bg-orange-50";
      case "advanced": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "Pemula";
      case "intermediate": return "Menengah";
      case "advanced": return "Mahir";
      default: return "Semua Level";
    }
  };

  const filteredTips = tips.filter(tip => tip.category === selectedCategory);
  const featuredTips = tips.filter(tip => tip.featured);

  const TipCard = ({ tip, featured = false }: { tip: typeof tips[0], featured?: boolean }) => (
    <Card className={`hover:shadow-lg transition-all cursor-pointer ${featured ? 'border-primary' : ''}`}>
      <div className="aspect-video overflow-hidden rounded-t-lg relative">
        <ImageWithFallback
          src={tip.image}
          alt={tip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {featured && (
            <Badge className="bg-primary">
              Unggulan
            </Badge>
          )}
          <Badge variant="outline" className="bg-white/90">
            {tip.type === 'video' ? (
              <Video className="w-3 h-3 mr-1" />
            ) : (
              <FileText className="w-3 h-3 mr-1" />
            )}
            {tip.type === 'video' ? 'Video' : 'Artikel'}
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className={`${getDifficultyColor(tip.difficulty)} border-0`}>
            {getDifficultyText(tip.difficulty)}
          </Badge>
        </div>
      </div>
      
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{tip.title}</CardTitle>
        <CardDescription className="line-clamp-3">{tip.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {tip.author}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {tip.readTime}
          </div>
          <div className="flex items-center">
            <Heart className="w-4 h-4 mr-1" />
            {tip.likes}
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-foreground">
            {userRole === 'teacher' ? 'Langkah Mengajar:' : 'Langkah-langkah:'}
          </p>
          <ul className="space-y-1">
            {tip.steps.slice(0, 3).map((step, index) => (
              <li key={index} className="flex items-start text-sm text-muted-foreground">
                <CheckCircle className="w-3 h-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                {step}
              </li>
            ))}
            {tip.steps.length > 3 && (
              <li className="text-sm text-muted-foreground ml-5">
                +{tip.steps.length - 3} langkah lainnya
              </li>
            )}
          </ul>
        </div>
        
        <Button className="w-full">
          <Eye className="w-4 h-4 mr-2" />
          {userRole === 'teacher' ? 'Lihat Panduan' : 'Baca Selengkapnya'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {userRole === 'teacher' ? 'Panduan Mengajar Literasi' : 'Tips & Tricks Literasi'}
        </h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher'
            ? 'Kumpulan panduan mengajar dan strategi terbukti untuk meningkatkan kemampuan literasi siswa'
            : 'Kumpulan tips praktis dan terbukti untuk meningkatkan kemampuan literasi Anda'
          }
        </p>
      </div>

      {/* Featured Tips */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500 mr-2" />
          <h2 className="text-2xl font-semibold">
            {userRole === 'teacher' ? 'Panduan Unggulan' : 'Tips Unggulan'}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTips.map(tip => (
            <TipCard key={tip.id} tip={tip} featured={true} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">
          {userRole === 'teacher' ? 'Kategori Panduan' : 'Kategori Tips'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className={`hover:shadow-md transition-all cursor-pointer ${
                  selectedCategory === category.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="flex flex-col items-center text-center p-6">
                  <Icon className={`w-8 h-8 ${category.color} mb-3`} />
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tips.filter(t => t.category === category.id).length} {userRole === 'teacher' ? 'panduan' : 'tips'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Tips by Category */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {categories.find(c => c.id === selectedCategory)?.name} {userRole === 'teacher' ? 'Panduan' : 'Tips'}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTips.map(tip => (
            <TipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </section>

      {/* Quick Tips */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          {userRole === 'teacher' ? 'Reminder Harian Guru' : 'Tips Cepat Harian'}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800">
                <Zap className="w-5 h-5 mr-2" />
                {userRole === 'teacher' ? 'Reminder Hari Ini' : 'Tip Hari Ini'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                {userRole === 'teacher'
                  ? '"Berikan feedback positif minimal 3 kali dalam setiap sesi pembelajaran. Apresiasi kecil membuat perbedaan besar!"'
                  : '"Baca setidaknya 15 menit setiap hari. Konsistensi kecil menghasilkan perubahan besar!"'
                }
              </p>
              <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-200">
                {userRole === 'teacher' ? 'Terapkan di Kelas' : 'Terapkan Sekarang'}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <Target className="w-5 h-5 mr-2" />
                Tantangan Minggu Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                {userRole === 'teacher'
                  ? '"Minta siswa menulis 3 kalimat refleksi setelah setiap bacaan. Bantu mereka mengembangkan pemikiran kritis!"'
                  : '"Tulis 3 kalimat ringkasan setelah membaca artikel atau buku. Tingkatkan pemahaman Anda!"'
                }
              </p>
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-200">
                Terima Tantangan
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}