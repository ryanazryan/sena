import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { 
  BookOpen, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
// import senaLogo from 'figma:asset/847780f818afd72c32829454920762a5430501f4.png';

interface LoginPageProps {
  onLogin: (role: 'student' | 'teacher') => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole);
    }, 1500);
  };

  const stats = [
    { icon: Users, label: 'Pengguna Aktif', value: '10,000+' },
    { icon: BookOpen, label: 'Buku Digital', value: '5,000+' },
    { icon: Award, label: 'Pencapaian', value: '50+' },
    { icon: TrendingUp, label: 'Tingkat Keberhasilan', value: '95%' }
  ];

  const roles = [
    {
      value: 'student' as const,
      label: 'Siswa',
      description: 'Akses pembelajaran, tugas, dan perpustakaan digital',
      icon: UserCheck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'teacher' as const,
      label: 'Guru',
      description: 'Kelola kelas, nilai tugas, dan pantau progress siswa',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:block space-y-8">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start mb-6">
              <img 
                // src={senaLogo} 
                alt="SENA Logo" 
                className="w-12 h-12 mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">SENA</h1>
                <p className="text-muted-foreground">Self-Learning Education for New Adventure</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Jelajahi Dunia Pembelajaran yang Tak Terbatas
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Bergabunglah dengan platform pembelajaran mandiri terdepan yang menyediakan 
              library digital, sistem evaluasi AI, dan panduan praktis untuk petualangan 
              pendidikan yang baru dan menarik.
            </p>
          </div>

          {/* Hero Image */}
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="SENA - Self-Learning Education Platform"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-4 bg-card rounded-lg border">
                  <Icon className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                // src={senaLogo} 
                alt="SENA Logo" 
                className="w-10 h-10 mr-3"
              />
              <div>
                <h1 className="text-2xl font-bold text-foreground">SENA</h1>
                <p className="text-sm text-muted-foreground">Self-Learning Education for New Adventure</p>
              </div>
            </div>
          </div>

          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-6">
              <CardTitle className="text-2xl">Selamat Datang Kembali</CardTitle>
              <CardDescription>
                Masuk ke akun Anda untuk melanjutkan petualangan pembelajaran
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-base">Masuk sebagai:</Label>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <div key={role.value} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={role.value}
                          name="role"
                          value={role.value}
                          checked={selectedRole === role.value}
                          onChange={(e) => setSelectedRole(e.target.value as 'student' | 'teacher')}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={role.value}
                          className={`flex-1 flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedRole === role.value 
                              ? `${role.borderColor} ${role.bgColor}` 
                              : 'border-border bg-card hover:bg-accent'
                          }`}
                        >
                          <div className={`p-2 rounded-md ${selectedRole === role.value ? role.bgColor : 'bg-muted'}`}>
                            <Icon className={`w-5 h-5 ${selectedRole === role.value ? role.color : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{role.label}</p>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedRole === role.value 
                              ? `${role.borderColor} bg-current` 
                              : 'border-muted-foreground'
                          }`}>
                            {selectedRole === role.value && (
                              <div className="w-2 h-2 rounded-full bg-white m-0.5"></div>
                            )}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username atau Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Masukkan username atau email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Ingat saya
                    </Label>
                  </div>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Lupa password?
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                      Memproses...
                    </div>
                  ) : (
                    <>
                      Masuk sebagai {selectedRole === 'student' ? 'Siswa' : 'Guru'}
                    </>
                  )}
                </Button>
              </form>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Atau masuk dengan</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Sekolah
                </Button>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Belum punya akun?{' '}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Daftar sekarang
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          {/* <Card className="mt-4 border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <p className="text-xs text-muted-foreground text-center mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-center space-y-1">
                <div className="mb-2">
                  <p className="font-medium">Siswa:</p>
                  <p><strong>Username:</strong> siswa@sena.edu</p>
                  <p><strong>Password:</strong> siswa123</p>
                </div>
                <div>
                  <p className="font-medium">Guru:</p>
                  <p><strong>Username:</strong> guru@sena.edu</p>
                  <p><strong>Password:</strong> guru123</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}