import image_99a0f1706e3b5fa04643c6836c8f3d7d7bae38f0 from 'figma:asset/99a0f1706e3b5fa04643c6836c8f3d7d7bae38f0.png';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Play, Star, Clock, Users, Trophy, Target, BookOpen, Zap } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface GamesPageProps {
  user: {
    type: 'student' | 'teacher';
    email: string;
    name?: string;
  };
  onBack: () => void;
}

export function GamesPage({ user, onBack }: GamesPageProps) {
  const games = [
    {
      id: 1,
      title: "Petualangan Literasi Nusantara",
      description: "Jelajahi cerita rakyat Indonesia sambil mengasah kemampuan membaca dan menulis",
      image: image_99a0f1706e3b5fa04643c6836c8f3d7d7bae38f0,
      category: "Literasi",
      difficulty: "Pemula",
      duration: "30 menit",
      players: "1-4 pemain",
      rating: 4.8,
      progress: 75,
      badges: ["Pembaca Aktif", "Explorer Budaya"],
      skills: ["Membaca", "Menulis", "Budaya Lokal"]
    }
  ];

  const categories = [
    { name: "Semua", count: games.length, active: true },
    { name: "Literasi", count: 1, active: false }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-teal-100 text-teal-800';
      case 'Menengah': return 'bg-blue-100 text-blue-800';
      case 'Lanjutan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
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
                <span className="text-xl text-gray-800">Game Center</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Level {user.type === 'student' ? '12' : 'Guru'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat Datang di Game Center! 🎮
          </h1>
          <p className="text-lg text-gray-600">
            Pilih game edukasi yang ingin kamu mainkan, {user.name?.split(' ')[0] || 'teman'}!
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={category.active ? "default" : "outline"}
                className={category.active ? 
                  "bg-teal-500 hover:bg-teal-600" : 
                  "border-gray-300 hover:border-teal-500 hover:text-teal-600"
                }
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-8">
          {games.map((game) => (
            <Card key={game.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Game Image */}
              <div className="relative h-48">
                <ImageWithFallback
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
                    {game.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{game.rating}</span>
                  </div>
                </div>
                {game.progress > 0 && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <div className="flex items-center justify-between text-white text-xs mb-1">
                        <span>Progress</span>
                        <span>{game.progress}%</span>
                      </div>
                      <Progress value={game.progress} className="h-1" />
                    </div>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {game.description}
                  </p>
                </div>

                {/* Game Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(game.difficulty)}>
                    {game.difficulty}
                  </Badge>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Skill yang dipelajari:</p>
                  <div className="flex flex-wrap gap-2">
                    {game.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Badges */}
                {game.badges.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Badge yang bisa didapat:</p>
                    <div className="flex flex-wrap gap-2">
                      {game.badges.map((badge, index) => (
                        <div key={index} className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          <Trophy className="w-3 h-3" />
                          <span>{badge}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 font-bold">
                    <Play className="w-4 h-4 mr-2" />
                    Mainkan
                  </Button>
                  <Button variant="outline" className="border-gray-300 hover:border-teal-500 hover:text-teal-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-teal-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Statistik Bermain Kamu</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">12</div>
                <div className="text-teal-100 text-sm">Game Dimainkan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">47</div>
                <div className="text-teal-100 text-sm">Badge Dikumpulkan</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">156</div>
                <div className="text-teal-100 text-sm">Jam Bermain</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">8.7</div>
                <div className="text-teal-100 text-sm">Rating Rata-rata</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span>Pencapaian Terbaru</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Master Literasi!</h4>
                  <p className="text-sm text-gray-600">Selesaikan 10 level berturut-turut tanpa error</p>
                  <p className="text-xs text-gray-500">Didapat 2 hari yang lalu</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-teal-50 rounded-lg">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Konsisten Bermain</h4>
                  <p className="text-sm text-gray-600">Bermain setiap hari selama 1 minggu</p>
                  <p className="text-xs text-gray-500">Didapat 5 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}