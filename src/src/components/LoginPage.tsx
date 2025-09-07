import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { GraduationCap, Users, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface LoginPageProps {
  onBack: () => void;
  onLogin: (userType: 'student' | 'teacher', email: string, password: string) => boolean;
}

export function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [studentData, setStudentData] = useState({ email: '', password: '' });
  const [teacherData, setTeacherData] = useState({ email: '', password: '' });

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('student', studentData.email, studentData.password);
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('teacher', teacherData.email, teacherData.password);
  };

  const fillDemoAccount = (userType: 'student' | 'teacher', accountIndex: number) => {
    const demoAccounts = {
      student: [
        { email: 'andi.siswa@gmail.com', password: 'siswa123' },
        { email: 'sari.siswa@gmail.com', password: 'siswa123' },
        { email: 'budi.siswa@gmail.com', password: 'siswa123' }
      ],
      teacher: [
        { email: 'pak.ahmad@sdn1malang.sch.id', password: 'guru123' },
        { email: 'bu.siti@sdn2malang.sch.id', password: 'guru123' },
        { email: 'pak.rizki@sdn3malang.sch.id', password: 'guru123' }
      ]
    };

    const account = demoAccounts[userType][accountIndex];
    if (userType === 'student') {
      setStudentData({ email: account.email, password: account.password });
    } else {
      setTeacherData({ email: account.email, password: account.password });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-teal-600 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <Card className="border-2 border-gray-200 shadow-lg bg-white">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 rounded-xl">
                <span className="text-2xl font-bold">SENA</span>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-900">Masuk ke SENA</CardTitle>
              <p className="text-gray-600 mt-2">Pilih jenis akun Anda untuk melanjutkan</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Siswa</span>
                </TabsTrigger>
                <TabsTrigger value="teacher" className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>Guru</span>
                </TabsTrigger>
              </TabsList>

              {/* Student Login */}
              <TabsContent value="student" className="space-y-6 mt-6">
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <Users className="w-12 h-12 text-teal-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-teal-900">Portal Siswa</h3>
                  <p className="text-sm text-teal-700">Akses game edukasi dan materi pembelajaran</p>
                </div>

                {/* Demo Accounts */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">🎮 Akun Demo Siswa</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Andi Pratama</span>
                        <span className="text-gray-600 block">andi.siswa@gmail.com</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => fillDemoAccount('student', 0)}
                        className="text-xs"
                      >
                        Coba
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Sari Dewi</span>
                        <span className="text-gray-600 block">sari.siswa@gmail.com</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => fillDemoAccount('student', 1)}
                        className="text-xs"
                      >
                        Coba
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Budi Santoso</span>
                        <span className="text-gray-600 block">budi.siswa@gmail.com</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => fillDemoAccount('student', 2)}
                        className="text-xs"
                      >
                        Coba
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-blue-700 mt-3">Password semua akun: <span className="font-mono bg-white px-1 rounded">siswa123</span></p>
                </div>

                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-email">Email</Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="nama@email.com"
                      value={studentData.email}
                      onChange={(e) => setStudentData({...studentData, email: e.target.value})}
                      className="bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={studentData.password}
                        onChange={(e) => setStudentData({...studentData, password: e.target.value})}
                        className="bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-teal-500 focus:ring-teal-500 border-gray-300 rounded" />
                      <span className="text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" className="text-teal-600 hover:text-teal-700">Lupa password?</a>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                    Masuk sebagai Siswa
                  </Button>
                </form>
              </TabsContent>

              {/* Teacher Login */}
              <TabsContent value="teacher" className="space-y-6 mt-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <GraduationCap className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-900">Portal Guru</h3>
                  <p className="text-sm text-blue-700">Kelola kelas dan pantau progress siswa</p>
                </div>

                {/* Demo Accounts */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-3">👩‍🏫 Akun Demo Guru</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Ahmad Wijaya, S.Pd</span>
                        <span className="text-gray-600 block">pak.ahmad@sdn1malang.sch.id</span>
                        <span className="text-xs text-gray-500">Guru Matematika</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => fillDemoAccount('teacher', 0)}
                        className="text-xs"
                      >
                        Coba
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Siti Nurhaliza, S.Pd</span>
                        <span className="text-gray-600 block">bu.siti@sdn2malang.sch.id</span>
                        <span className="text-xs text-gray-500">Guru Bahasa Indonesia</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => fillDemoAccount('teacher', 1)}
                        className="text-xs"
                      >
                        Coba
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">Rizki Rahman, S.Pd</span>
                        <span className="text-gray-600 block">pak.rizki@sdn3malang.sch.id</span>
                        <span className="text-xs text-gray-500">Guru IPA</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => fillDemoAccount('teacher', 2)}
                        className="text-xs"
                      >
                        Coba
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mt-3">Password semua akun: <span className="font-mono bg-white px-1 rounded">guru123</span></p>
                </div>

                <form onSubmit={handleTeacherLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="guru@sekolah.com"
                      value={teacherData.email}
                      onChange={(e) => setTeacherData({...teacherData, email: e.target.value})}
                      className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacher-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="teacher-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={teacherData.password}
                        onChange={(e) => setTeacherData({...teacherData, password: e.target.value})}
                        className="bg-white border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
                      <span className="text-gray-600">Ingat saya</span>
                    </label>
                    <a href="#" className="text-blue-600 hover:text-blue-700">Lupa password?</a>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    Masuk sebagai Guru
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <p className="text-gray-600">
                Belum punya akun?{' '}
                <button 
                  onClick={() => window.location.hash = '#register'}
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 text-center space-y-2">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🚀</span>
              <span className="font-semibold text-yellow-800">Platform Demo</span>
            </div>
            <p className="text-sm text-yellow-700">
              Ini adalah versi demo SENA. Gunakan akun demo di atas untuk mencoba semua fitur platform pembelajaran!
            </p>
          </div>
          
          <p className="text-sm text-gray-600">
            Butuh bantuan? <a href="#" className="text-teal-600 hover:text-teal-700">Hubungi Support</a>
          </p>
          <p className="text-xs text-gray-500">
            © 2025 SENA Learning Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}