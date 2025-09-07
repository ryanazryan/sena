import { Gamepad2, Brain, Trophy, Users, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: Gamepad2,
      title: "Game Interaktif",
      description: "Pembelajaran melalui game yang menyenangkan dan interaktif untuk meningkatkan engagement siswa",
      color: "text-teal-500 bg-teal-100"
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "Sistem pembelajaran yang menyesuaikan dengan kemampuan dan kecepatan belajar setiap siswa",
      color: "text-blue-500 bg-blue-100"
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Sistem reward dan badge untuk memotivasi siswa mencapai target pembelajaran",
      color: "text-teal-500 bg-teal-100"
    },
    {
      icon: Users,
      title: "Kolaborasi",
      description: "Fitur multiplayer dan diskusi untuk mendorong pembelajaran kolaboratif antar siswa",
      color: "text-blue-500 bg-blue-100"
    },
    {
      icon: Shield,
      title: "Aman & Terpercaya",
      description: "Platform yang aman dengan content yang sudah dikurasi oleh ahli pendidikan",
      color: "text-teal-500 bg-teal-100"
    },
    {
      icon: Zap,
      title: "Real-time Progress",
      description: "Tracking progress belajar secara real-time dengan analitik yang mendalam",
      color: "text-blue-500 bg-blue-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Mengapa Memilih <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">SENA</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Platform pembelajaran game-based yang menggabungkan teknologi modern dengan metode pembelajaran yang terbukti efektif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}