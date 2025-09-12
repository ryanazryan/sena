import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { registerUser, signInWithGoogle } from "../lib/auth";
import { User as FirebaseUser } from "firebase/auth";
import { X, Chrome } from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

interface RegisterPageProps {
  onBack: () => void;
  onShowLogin: () => void;
  onRegisterSuccess: (user: FirebaseUser) => void; 
}

export function RegisterPage({ onBack, onShowLogin, onRegisterSuccess }: RegisterPageProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [kelas, setKelas] = useState("");
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'student' && !kelas) {
      toast.error("Registrasi Gagal", {
        description: "Sebagai siswa, Anda wajib memilih kelas."
      });
      return; 
    }
    
    setIsLoading(true);

    const { user, error } = await registerUser(
      namaLengkap,
      email,
      password,
      confirmPassword,
      selectedRole,
      kelas
    );

    setIsLoading(false);
    if (error) {
      toast.error("Registrasi Gagal", {
        description: error
      });
    } else if (user) {
      toast.success("Registrasi Berhasil!", {
        description: "Silakan masuk untuk melanjutkan."
      });
      // Memanggil onRegisterSuccess yang akan ditangani oleh App.tsx
      onRegisterSuccess(user);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { user, error } = await signInWithGoogle();
    setIsLoading(false);

    if (user) {
      toast.success("Login dengan Google Berhasil!");
      onShowLogin();
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
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            {selectedRole === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas</Label>
                <Select value={kelas} onValueChange={setKelas} required>
                  <SelectTrigger id="kelas">
                    <SelectValue placeholder="-- Pilih Kelas Anda --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kelas 7A">Kelas 7A</SelectItem>
                    <SelectItem value="Kelas 7B">Kelas 7B</SelectItem>
                    <SelectItem value="Kelas 8A">Kelas 8A</SelectItem>
                    <SelectItem value="Kelas 8B">Kelas 8B</SelectItem>
                    <SelectItem value="Kelas 9A">Kelas 9A</SelectItem>
                    <SelectItem value="Kelas 9B">Kelas 9B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
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

