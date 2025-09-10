import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { sendPasswordReset } from "../lib/auth";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Toaster } from "../components/ui/sonner";
import { toast } from "sonner";

interface ForgotPasswordPageProps {
  onShowLogin: () => void;
}

export function ForgotPasswordPage({ onShowLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email tidak boleh kosong.");
      return;
    }
    setIsLoading(true);
    const { success, error } = await sendPasswordReset(email);
    setIsLoading(false);
    if (success) {
      toast.success("Email reset password telah dikirim!", {
        description: "Silakan periksa kotak masuk Anda (dan folder spam) untuk melanjutkan.",
      });
    } else {
      toast.error("Gagal mengirim email", {
        description: error || "Terjadi kesalahan yang tidak diketahui.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Lupa Password</CardTitle>
          <CardDescription>
            Masukkan email Anda dan kami akan mengirimkan tautan untuk mereset password Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Kirim Tautan Reset"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
             <Button variant="link" onClick={onShowLogin} className="text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Halaman Login
              </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

