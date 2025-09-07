import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { loginUser, signInWithGoogle } from "../lib/auth";
import { Mail, Lock, Eye, EyeOff, X, Chrome } from "lucide-react";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { cn } from "./ui/utils";

interface LoginPageProps {
  onBack: () => void;
  onLogin: () => void;
  onShowRegister: () => void;
}

export function LoginPage({ onBack, onLogin, onShowRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { user, error } = await loginUser(email, password);

    setIsLoading(false);
    if (user) {
      toast.success("Login Berhasil!");
      onLogin(); 
    } else {
      toast.error("Login Gagal", {
        description: error || "Email atau password salah."
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { user, error } = await signInWithGoogle();
    setIsLoading(false);

    if (user) {
      toast.success("Login dengan Google Berhasil!");
      onLogin(); 
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
              <CardTitle className="text-2xl">Masuk</CardTitle>
              <CardDescription>
                Selamat datang kembali! Silakan masukkan detail Anda.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent> 
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="contoh@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pl-10 pr-10" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
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
            Masuk dengan Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Belum punya akun?{' '}
            <Button variant="link" className="p-0 h-auto" type="button" onClick={onShowRegister}>
              Daftar sekarang
            </Button>
          </p>
        </CardContent> 
      </Card>
      <Toaster />
    </div>
  );
}