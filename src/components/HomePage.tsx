import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { BookOpen, Gamepad2, GraduationCap, Users, Award, TrendingUp, User, UserCheck, Lightbulb } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onSectionChange: (section: string) => void;
  userRole?: 'student' | 'teacher' | null;
}

export function HomePage({ onSectionChange, userRole }: HomePageProps) {
  const features = [
    {
      id: 'library',
      title: 'Library Digital',
      description: userRole === 'teacher' 
        ? 'Kelola koleksi buku dan rekomendasi untuk siswa'
        : 'Akses ribuan buku digital gratis untuk semua tingkatan',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'games',
      title: 'SENA Games',
      description: userRole === 'teacher'
        ? 'Kelola game edukatif dan pantau progress siswa dalam pembelajaran gamifikasi'
        : 'Tingkatkan literasi melalui game edukatif yang seru dan menantang',
      icon: Gamepad2,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'coaching',
      title: 'Coaching Clinic',
      description: userRole === 'teacher'
        ? 'Akses coaching profesional untuk pengembangan skill mengajar literasi'
        : 'Bimbingan personal dari coach berpengalaman untuk kemampuan literasi',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    }
  ];

  const getStatsForRole = () => {
    if (userRole === 'teacher') {
      return [
        { icon: Users, label: 'Siswa Aktif', value: '156' },
        { icon: GraduationCap, label: 'Kelas Dikelola', value: '8' },
        { icon: Award, label: 'Tugas Dibuat', value: '45' },
        { icon: TrendingUp, label: 'Rata-rata Nilai', value: '87' }
      ];
    }
    return [
      { icon: Users, label: 'Pengguna Aktif', value: '10,000+' },
      { icon: BookOpen, label: 'Buku Digital', value: '5,000+' },
      { icon: Award, label: 'Pencapaian', value: '50+' },
      { icon: TrendingUp, label: 'Tingkat Keberhasilan', value: '95%' }
    ];
  };

  const stats = getStatsForRole();

  const getWelcomeMessage = () => {
    if (userRole === 'teacher') {
      return {
        title: 'Selamat Datang, Guru!',
        subtitle: 'Kelola pembelajaran dan pantau progress siswa dengan mudah di platform SENA',
        ctaText: 'Mulai Mengajar'
      };
    }
    return {
      title: 'Selamat Datang di SENA',
      subtitle: 'Self-Learning Education for New Adventure - Platform pembelajaran mandiri yang menghadirkan petualangan baru dalam dunia pendidikan dengan teknologi AI dan koleksi digital terlengkap',
      ctaText: 'Mulai Petualangan'
    };
  };

  const welcomeMsg = getWelcomeMessage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Role Badge */}
      {userRole && (
        <div className="flex justify-center mb-6">
          <Badge className={`${userRole === 'teacher' ? 'bg-green-600' : 'bg-blue-600'} text-white px-4 py-2`}>
            {userRole === 'teacher' ? (
              <User className="w-4 h-4 mr-2" />
            ) : (
              <UserCheck className="w-4 h-4 mr-2" />
            )}
            Mode {userRole === 'teacher' ? 'Guru' : 'Siswa'}
          </Badge>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {welcomeMsg.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          {welcomeMsg.subtitle}
        </p>
        <div className="aspect-video max-w-4xl mx-auto mb-8 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={userRole === 'teacher' 
              ? "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              : "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            }
            alt={userRole === 'teacher' ? "SENA Platform Pengajaran" : "SENA - Platform Pembelajaran Mandiri"}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
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

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => onSectionChange(feature.id)}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  {userRole === 'teacher' ? 'Kelola' : 'Mulai Sekarang'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role-specific Quick Actions */}
      {userRole === 'teacher' && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Aksi Cepat Guru</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <Gamepad2 className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Kelola Games</p>
                  <p className="text-xs text-muted-foreground">SENA Games</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <Users className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Kelola Siswa</p>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <Award className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">Review Nilai</p>
                  <p className="text-xs text-muted-foreground">AI Grading</p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center p-4">
                <BookOpen className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="font-medium">Rekomendasi Buku</p>
                  <p className="text-xs text-muted-foreground">Library</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">
          {userRole === 'teacher' 
            ? 'Tingkatkan Efektivitas Pengajaran dengan SENA!'
            : 'Mulai Petualangan Pembelajaran Anda Hari Ini!'
          }
        </h2>
        <p className="text-lg mb-6 opacity-90">
          {userRole === 'teacher'
            ? 'Manfaatkan teknologi AI SENA untuk memberikan pembelajaran yang lebih efektif dan pengalaman belajar yang tak terlupakan'
            : 'Bergabunglah dengan ribuan pembelajar yang telah memulai petualangan pendidikan mereka dengan SENA'
          }
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="secondary" size="lg" onClick={() => onSectionChange('library')}>
            {userRole === 'teacher' ? 'Kelola Library' : 'Jelajahi Library Digital'}
          </Button>
          <Button variant="outline" size="lg" className="border-white hover:bg-gray-200 hover:text-primary" 
                  onClick={() => onSectionChange('games')}>
            {userRole === 'teacher' ? 'Kelola Games' : 'Main SENA Games'}
          </Button>
        </div>
      </div>
    </div>
  );
}