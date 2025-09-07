import image_885fbf941299017d7a3af4b009f465b0425e769c from 'figma:asset/885fbf941299017d7a3af4b009f465b0425e769c.png';
import { Button } from "./ui/button";
import { Play, Star, Users, BookOpen } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-teal-50 via-blue-50 to-teal-100 min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-700">Platform Pembelajaran #1 di Indonesia</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                SENA
              </span>
              <br />
              Learning Adventure
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg">
              Pengembangan Game Edukasi Self-Learning Experience for New Adventure (SENA) 
              untuk Meningkatkan Kemampuan Literasi berbasis Kearifan Lokal
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
              <Play className="w-5 h-5 mr-2" />
              Mulai Belajar
            </Button>
            <Button variant="outline" size="lg">
              Jelajahi Games
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">1000+</div>
              <div className="text-sm text-gray-600">Siswa Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div className="text-sm text-gray-600">Game Edukasi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">95%</div>
              <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>

        {/* Right Content - Hero Image */}
        <div className="relative">
          <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
            <ImageWithFallback
              src={image_885fbf941299017d7a3af4b009f465b0425e769c}
              alt="Learning Character"
              className="w-full h-auto rounded-2xl"
            />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-lg border">
            <Users className="w-6 h-6 text-teal-500" />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-lg border">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    </section>
  );
}