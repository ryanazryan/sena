import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, BookOpen, Download, Users, Clock, Eye, Target, Lightbulb, Book } from "lucide-react";

interface GuidePageProps {
  user: {
    type: 'student' | 'teacher';
    email: string;
    name?: string;
  };
  onBack: () => void;
}

export function GuidePage({ user, onBack }: GuidePageProps) {
  // Early return if user is not provided
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">User tidak ditemukan</p>
          <Button onClick={onBack}>Kembali</Button>
        </div>
      </div>
    );
  }
  const learningStages = [
    {
      id: 1,
      title: "Stage 1 - Dasar Literasi",
      subtitle: "Mengakses dan Menemukan Informasi",
      participants: "1,250+ pemain",
      duration: "15-20 menit/sesi",
      week: "Minggu 1",
      icon: Target,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      badgeColor: "bg-green-600",
      buttonColor: "bg-green-600 hover:bg-green-700",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      id: 2,
      title: "Stage 2 - Pemahaman Konteks",
      subtitle: "Menginterpretasi dan Mengintegrasikan",
      participants: "890+ pemain",
      duration: "20-25 menit/sesi",
      week: "Minggu 2",
      icon: Lightbulb,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      badgeColor: "bg-orange-500",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      id: 3,
      title: "Stage 3 - Literasi Lanjutan",
      subtitle: "Mengevaluasi dan Merefleksi",
      participants: "650+ pemain",
      duration: "25-30 menit/sesi",
      week: "Minggu 3",
      icon: Book,
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      badgeColor: "bg-gray-600",
      buttonColor: "bg-gray-600 hover:bg-gray-700",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600"
    }
  ];

  const handleDownloadPDF = () => {
    // Create a mock PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'panduan-sena-games.pdf';
    link.click();
    alert("Download PDF akan dimulai dalam beberapa detik...");
  };

  const handleStartStage = (stageId: number) => {
    if (user.type === 'student') {
      alert(`Memulai Stage ${stageId}! Anda akan dialihkan ke permainan...`);
    } else {
      alert(`Membuka Stage ${stageId} untuk review guru...`);
    }
  };

  const handlePreview = (stageId: number) => {
    alert(`Menampilkan preview Stage ${stageId}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            </div>
            
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg mr-4 ${
                user.type === 'student' 
                  ? 'text-orange-600 bg-orange-100' 
                  : 'text-blue-600 bg-blue-100'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  user.type === 'student' ? 'bg-orange-600' : 'bg-blue-600'
                }`}></span>
                <span>{user.type === 'student' ? 'Siswa' : 'Guru'}</span>
              </div>
              
              <nav className="flex items-center space-x-6">
                <button 
                  type="button"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-teal-600 rounded-lg hover:bg-gray-100"
                >
                  <span>🏠</span>
                  <span>Beranda</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-teal-600 rounded-lg hover:bg-gray-100"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Library Digital</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg"
                >
                  <span>🎮</span>
                  <span>Games</span>
                </button>
                <button 
                  type="button"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-teal-600 rounded-lg hover:bg-gray-100"
                >
                  <span>🎯</span>
                  <span>Coaching Clinic</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with SENA logo */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg">
              <span className="font-bold">SENA</span>
            </div>
            <span className="text-sm text-gray-600">Self-Learning Education for New Adventure</span>
          </div>
        </div>

        {/* PDF Download Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="w-5 h-5 text-gray-600" />
            <h2 className="font-semibold text-gray-800">Buku Panduan PDF - Semua Stage</h2>
          </div>
          <p className="text-gray-600 mb-6">Download panduan lengkap untuk memaksimalkan pengalaman bermain game edukasi</p>

          {/* PDF Card */}
          <Card className="max-w-2xl bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Panduan Lengkap SENA Games</h3>
                  <Badge variant="outline" className="mb-3 text-xs">
                    Semua Stage
                  </Badge>
                  <p className="text-sm text-gray-600 mb-4">
                    Panduan komprehensif untuk semua stage pembelajaran dengan tips dan strategi bermain yang efektif
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>45 halaman</span>
                      <span>2.8 MB</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-6">
                <Button 
                  onClick={handleDownloadPDF}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Stages */}
        <div className="space-y-4">
          {learningStages.map((stage, index) => (
            <Card 
              key={stage.id} 
              className={`${stage.bgColor} ${stage.borderColor} border-2 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden`}
            >
              {/* Week Badge */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Badge className={`${stage.badgeColor} text-white text-xs`}>
                  {stage.week}
                </Badge>
                {index < 2 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePreview(stage.id)}
                    className="text-xs bg-gray-600 text-white border-gray-600 hover:bg-gray-700"
                  >
                    Preview
                  </Button>
                )}
              </div>

              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon */}
                    <div className={`w-12 h-12 ${stage.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <stage.icon className={`w-6 h-6 ${stage.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{stage.title}</h3>
                      <p className="text-gray-600 mb-4">{stage.subtitle}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{stage.participants}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{stage.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleStartStage(stage.id)}
                    className={`${stage.buttonColor} text-white px-6 py-2 ml-4`}
                  >
                    Mulai Stage {stage.id}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Butuh bantuan tambahan? 
            <Button variant="link" className="text-teal-600 p-0 ml-1">
              Hubungi Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}