import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Target, Lightbulb, Heart, Award } from "lucide-react";

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: "Misi Kami",
      description: "Menciptakan platform pembelajaran yang mengintegrasikan teknologi game dengan kurikulum pendidikan untuk menciptakan pengalaman belajar yang efektif dan menyenangkan."
    },
    {
      icon: Lightbulb,
      title: "Inovasi",
      description: "Mengembangkan metode pembelajaran inovatif berbasis kearifan lokal yang dapat meningkatkan kemampuan literasi siswa secara berkelanjutan."
    },
    {
      icon: Heart,
      title: "Komitmen",
      description: "Berkomitmen untuk memberikan akses pendidikan berkualitas yang dapat dijangkau oleh semua kalangan dengan mengedepankan nilai-nilai budaya lokal."
    },
    {
      icon: Award,
      title: "Kualitas",
      description: "Memastikan setiap konten pembelajaran telah melalui proses kurasi ketat oleh tim ahli pendidikan dan teknologi pembelajaran."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Tentang <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">SENA</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                SENA (Self-learning Experience for New Adventure) adalah platform pembelajaran digital yang 
                dikembangkan oleh Tim UKM Jurusan Teknologi Pendidikan FIP UM 2025. Platform ini menggabungkan 
                konsep gamifikasi dengan kurikulum pendidikan untuk menciptakan pengalaman belajar yang interaktif 
                dan menyenangkan.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    Pengembangan game edukasi berbasis kearifan lokal untuk meningkatkan literasi
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    Implementasi teknologi pembelajaran adaptif yang menyesuaikan dengan kebutuhan siswa
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-600">
                    Kolaborasi dengan institusi pendidikan untuk memastikan kualitas konten pembelajaran
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button size="lg" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600">
                  Pelajari Lebih Lanjut
                </Button>
                <Button variant="outline" size="lg">
                  Hubungi Tim
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-br from-teal-100 to-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Pencapaian SENA</h3>
            <p className="text-teal-100 max-w-2xl mx-auto">
              Hasil yang telah dicapai dalam mengembangkan ekosistem pembelajaran digital yang inovatif
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-teal-100">Siswa Terdaftar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-teal-100">Game Edukasi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">25+</div>
              <div className="text-teal-100">Sekolah Partner</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">95%</div>
              <div className="text-teal-100">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}