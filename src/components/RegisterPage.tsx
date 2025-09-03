// src/components/RegisterPage.tsx

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { registerUser } from "../lib/auth";

interface RegisterPageProps {
  onShowLogin: () => void;
}

export function RegisterPage({ onShowLogin }: RegisterPageProps) {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [kodeKelas, setKodeKelas] = useState("");
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await registerUser(
      namaLengkap,
      email,
      password,
      selectedRole,
      kodeKelas
    );

    setIsLoading(false);
    if (error) {
      setError(error);
    } else {
      onShowLogin();
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
          <CardDescription>
            Bergabunglah dengan SENA untuk memulai petualangan belajar Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={selectedRole === 'student' ? 'default' : 'outline'} onClick={() => setSelectedRole('student')}>Saya Siswa</Button>
                <Button type="button" variant={selectedRole === 'teacher' ? 'default' : 'outline'} onClick={() => setSelectedRole('teacher')}>Saya Guru</Button>
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

            {selectedRole === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="kodeKelas">Kode Kelas (Opsional)</Label>
                <Input 
                  id="kodeKelas" 
                  placeholder="Bisa diisi nanti dari dashboard" 
                  value={kodeKelas} 
                  onChange={(e) => setKodeKelas(e.target.value)} 
                />
              </div>
            )}
            
            {error && <p className="text-sm text-center text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Mendaftarkan..." : "Daftar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Button variant="link" className="p-0 h-auto" type="button" onClick={onShowLogin}>
                Masuk di sini
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}