import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User, Lightbulb, GraduationCap, ArrowRight } from "lucide-react";

export function AboutSection() {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Misi Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Kami berkomitmen untuk menyediakan platform pendidikan yang inovatif,
            menyenangkan, dan terjangkau untuk semua.
          </p>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Personalisasi Pembelajaran</CardTitle>
                <CardDescription>
                  Setiap siswa unik. Platform kami menyesuaikan materi sesuai
                  dengan kecepatan dan gaya belajar masing-masing.
                </CardDescription>
              </CardHeader>
            </Card>
  
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-teal-600" />
                </div>
                <CardTitle>Inovasi Tanpa Henti</CardTitle>
                <CardDescription>
                  Kami terus berinovasi, menggabungkan AI dan gamifikasi untuk
                  menciptakan pengalaman belajar yang modern dan efektif.
                </CardDescription>
              </CardHeader>
            </Card>
  
            <Card className="bg-white hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-indigo-600" />
                </div>
                <CardTitle>Akses untuk Semua</CardTitle>
                <CardDescription>
                  Kami percaya pendidikan berkualitas harus bisa diakses oleh
                  siapa saja, di mana saja, kapan saja.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
  
          <Button size="lg" className="mt-12">
            Pelajari Lebih Lanjut
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    );
  }