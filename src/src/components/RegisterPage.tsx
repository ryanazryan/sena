import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface RegisterPageProps {
  onBack: () => void;
  onRegister: (userType: 'student' | 'teacher', email: string) => void;
}

export function RegisterPage({ onBack, onRegister }: RegisterPageProps) {
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    classCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      alert('Mohon lengkapi semua field yang wajib diisi!');
      return;
    }
    if (userType === 'student' && !formData.classCode) {
      alert('Kode kelas wajib diisi untuk siswa!');
      return;
    }
    onRegister(userType, formData.email);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* SENA Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl shadow-lg">
              <span className="text-3xl font-bold">SENA</span>
            </div>
            <div className="text-6xl">👦</div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun Anda</h1>
            <p className="text-gray-600">
              Ayo, bergabung di SENA untuk mendapatkan pengalaman 
              penggunaan platform belajar yang asyik!
            </p>
          </div>

          {/* User Type Toggle */}
          <div className="flex mb-8 border-2 border-gray-200 rounded-full p-1 bg-gray-50">
            <Button
              type="button"
              onClick={() => setUserType('student')}
              className={`px-8 py-2 rounded-full transition-all flex-1 ${
                userType === 'student'
                  ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm'
                  : 'bg-transparent hover:bg-gray-100 text-gray-600'
              }`}
            >
              Siswa
            </Button>
            <Button
              type="button"
              onClick={() => setUserType('teacher')}
              className={`px-8 py-2 rounded-full transition-all flex-1 ${
                userType === 'teacher'
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                  : 'bg-transparent hover:bg-gray-100 text-gray-600'
              }`}
            >
              Guru
            </Button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="text-gray-700">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="pl-12 bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-lg h-12 text-gray-800 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-12 bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-lg h-12 text-gray-800 placeholder:text-gray-500"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-gray-700">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-12 bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-lg h-12 text-gray-800 placeholder:text-gray-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Class Code (For Students Only) */}
            {userType === 'student' && (
              <div className="space-y-2">
                <Label className="text-gray-700">Kode Kelas (Wajib Untuk Siswa)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Masukkan kode kelas"
                    value={formData.classCode}
                    onChange={(e) => setFormData({...formData, classCode: e.target.value})}
                    className="pl-12 bg-white border-2 border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 rounded-lg h-12 text-gray-800 placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center space-x-2 py-2">
              <Checkbox 
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
                className="border-gray-300 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
              />
              <Label htmlFor="remember-me" className="text-gray-700 text-sm">
                Ingat saya
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg h-auto text-lg shadow-lg"
            >
              Daftar
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span>Sudah memiliki Akun?</span>
              <button 
                onClick={() => window.location.hash = '#login'}
                className="text-teal-600 hover:text-teal-700 underline font-medium"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="absolute top-4 right-4 z-20 text-gray-600 hover:text-teal-600 hover:bg-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Button>
    </div>
  );
}