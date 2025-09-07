import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { registerUser, signInWithGoogle } from "../lib/auth";
import { User as UserIcon, X, Chrome } from "lucide-react";
import { Toaster, toast } from "sonner";
import { cn } from "./ui/utils";

interface RegisterPageProps {
  onBack: () => void;
  onRegister: () => void;
  onShowLogin: () => void;
}

export function RegisterPage({ onBack, onRegister, onShowLogin }: RegisterPageProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await registerUser(
      namaLengkap,
      email,
      password,
      selectedRole,
      undefined // Kode kelas dikosongkan
    );

    setIsLoading(false);
    if (error) {
      toast.error("Registrasi Gagal", {
        description: error
      });
    } else {
      toast.success("Registrasi Berhasil!", {
        description: "Silakan login menggunakan akun baru Anda."
      });
      onRegister();
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { user, error } = await signInWithGoogle();
    setIsLoading(false);

    if (user) {
      toast.success("Login dengan Google Berhasil!");
      onRegister();
    } else {
      toast.error("Login Gagal", {
        description: error || "Gagal login dengan Google."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
              <CardDescription>
                Bergabunglah dengan SENA untuk memulai petualangan belajar Anda.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button" 
                  variant={selectedRole === 'student' ? 'default' : 'outline'} 
                  onClick={() => setSelectedRole('student')}
                >
                  Saya Siswa
                </Button>
                <Button 
                  type="button" 
                  variant={selectedRole === 'teacher' ? 'default' : 'outline'} 
                  onClick={() => setSelectedRole('teacher')}
                >
                  Saya Guru
                </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" value={namaLengkap} onChange={(e) => setNamaLengkap(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </Button>
          </form>

          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Atau</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Chrome className="w-4 h-4 mr-2" />
            Daftar dengan Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Sudah punya akun?{" "}
            <Button variant="link" className="p-0 h-auto" type="button" onClick={onShowLogin}>
              Masuk di sini
            </Button>
          </p>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}