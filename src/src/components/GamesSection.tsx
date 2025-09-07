import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Play, Star, Clock, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function GamesSection() {
  const games = [
    {
      title: "Petualangan Literasi",
      description: "Game RPG yang mengajarkan kemampuan membaca dan menulis melalui petualangan seru",
      image: "https://images.unsplash.com/photo-1717588282722-ab1beb899c26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwY29udHJvbGxlciUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NTcwODc0MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      duration: "30 menit",
      players: "1-4 pemain",
      level: "Pemula",
      category: "Literasi"
    },
    {
      title: "Matematika Seru",
      description: "Puzzle game yang membuat belajar matematika menjadi menyenangkan dan mudah dipahami",
      image: "https://images.unsplash.com/photo-1595707678349-4b3f482bfbd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXp6bGUlMjBnYW1lJTIwY29sb3JmdWx8ZW58MXx8fHwxNzU3MDA3MDA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.7,
      duration: "25 menit",
      players: "1-2 pemain",
      level: "Menengah",
      category: "Matematika"
    },
    {
      title: "Eksplorasi Sains",
      description: "Game simulasi untuk memahami konsep sains melalui eksperimen virtual yang interaktif",
      image: "https://images.unsplash.com/photo-1628605007510-696cd5731961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZGlnaXRhbCUyMGxlYXJuaW5nJTIwdGFibGV0fGVufDF8fHx8MTc1NzA4NzQwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9,
      duration: "45 menit",
      players: "1-6 pemain",
      level: "Lanjutan",
      category: "Sains"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Game Edukasi <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Terpopuler</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi koleksi game edukasi terbaik yang dirancang khusus untuk meningkatkan kemampuan belajar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <ImageWithFallback
                  src={game.image}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {game.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">{game.rating}</span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{game.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{game.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Level: {game.level}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.level === 'Pemula' ? 'bg-teal-100 text-teal-800' :
                      game.level === 'Menengah' ? 'bg-blue-100 text-blue-800' :
                      'bg-teal-100 text-teal-800'
                    }`}>
                      {game.level}
                    </span>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  Mainkan Sekarang
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Lihat Semua Game
          </Button>
        </div>
      </div>
    </section>
  );
}