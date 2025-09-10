import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MailCheck } from "lucide-react";
import { auth } from "../lib/firebase";
import { sendEmailVerification, User } from "firebase/auth";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface VerifyEmailPageProps {
  user: User;
  onBackToLogin: () => void;
}

export function VerifyEmailPage({ user, onBackToLogin }: VerifyEmailPageProps) {
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendVerification = async () => {
    if (countdown > 0) return;

    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Email verifikasi baru telah dikirim!");
      setCountdown(60); // Set jeda waktu 60 detik
    } catch (error: any) {
      toast.error("Gagal mengirim ulang email.", {
        description: "Terjadi kesalahan atau Anda terlalu sering meminta. Coba lagi nanti."
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-primary mb-4" />
            <CardTitle className="text-2xl">Verifikasi Email Anda</CardTitle>
            <CardDescription>
                Kami telah mengirimkan tautan verifikasi ke <strong>{user.email}</strong>. Proses ini mungkin memerlukan beberapa menit. Silakan periksa kotak masuk Anda (dan folder spam).
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
                Setelah memverifikasi alamat email Anda dengan mengklik tautan yang kami kirimkan, Anda dapat kembali dan login ke akun Anda.
            </p>
            <Button onClick={onBackToLogin} className="w-full">
                Kembali ke Halaman Login
            </Button>
            <div className="text-xs text-muted-foreground">
                Tidak menerima email?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs" 
                  onClick={handleResendVerification} 
                  disabled={isSending || countdown > 0}
                >
                  {isSending 
                    ? "Mengirim..." 
                    : countdown > 0 
                    ? `Kirim ulang dalam ${countdown} detik`
                    : "Kirim ulang"}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
