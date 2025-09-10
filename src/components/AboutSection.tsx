import { Card, CardContent } from "../components/ui/card";
import { Gamepad2, Brain, Trophy, Users, Shield, Zap } from "lucide-react";

// Data fitur dengan skema warna yang lebih bervariasi
const features = [
  {
    icon: Gamepad2,
    title: "Game Interaktif",
    description: "Pembelajaran melalui game yang menyenangkan untuk meningkatkan keterlibatan siswa.",
    colorClasses: "bg-teal-100 text-teal-600",
  },
  {
    icon: Brain,
    title: "Adaptive Learning",
    description: "Sistem yang menyesuaikan dengan kecepatan dan kemampuan belajar setiap siswa.",
    colorClasses: "bg-sky-100 text-sky-600",
  },
  {
    icon: Trophy,
    title: "Achievement System",
    description: "Sistem reward dan lencana untuk memotivasi siswa mencapai target pembelajaran.",
    colorClasses: "bg-amber-100 text-amber-600",
  },
  {
    icon: Users,
    title: "Kolaborasi",
    description: "Fitur multiplayer dan diskusi untuk mendorong pembelajaran kolaboratif antar siswa.",
    colorClasses: "bg-rose-100 text-rose-600",
  },
  {
    icon: Shield,
    title: "Aman & Terpercaya",
    description: "Platform yang aman dengan konten yang sudah dikurasi oleh para ahli pendidikan.",
    colorClasses: "bg-violet-100 text-violet-600",
  },
  {
    icon: Zap,
    title: "Real-time Progress",
    description: "Lacak kemajuan belajar secara real-time dengan analitik yang mendalam.",
    colorClasses: "bg-green-100 text-green-600",
  },
];

export function AboutSection() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-gray-50 overflow-hidden">
      {/* Latar belakang animasi blob ini akan berfungsi jika tailwind.config.js sudah diatur */}
      <div className="absolute top-0 -left-48 w-[40rem] h-[40rem] bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-48 w-[40rem] h-[40rem] bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-64 left-20 w-[40rem] h-[40rem] bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mt-6">
            Mengapa Memilih <span className="bg-gradient-to-r from-teal-500 to-sky-500 bg-clip-text text-transparent">SENA</span>?
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Platform pembelajaran berbasis game yang menggabungkan teknologi modern dengan metode yang terbukti efektif untuk menciptakan pengalaman belajar yang tak terlupakan.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                // KELAS ANIMASI DITAMBAHKAN DI SINI
                className="bg-white/60 backdrop-blur-lg mb-6 border border-white/20 rounded-2xl shadow-lg hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group"
              >
                <CardContent className="p-8 text-center">
                  {/* KELAS ANIMASI IKON DITAMBAHKAN DI SINI */}
                  <div className={`w-20 h-20 ${feature.colorClasses} rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-white/50 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-9 h-9" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

