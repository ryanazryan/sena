import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MailCheck } from "lucide-react";
import { auth } from "../lib/firebase";
import { sendEmailVerification, User } from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";

interface VerifyEmailPageProps {
  user: User;
  onBackToLogin: () => void;
}

export function VerifyEmailPage({ user, onBackToLogin }: VerifyEmailPageProps) {
  const [isSending, setIsSending] = useState(false);

  const handleResendVerification = async () => {
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Email verifikasi baru telah dikirim!");
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
                Kami telah mengirimkan tautan verifikasi ke <strong>{user.email}</strong>. Silakan periksa kotak masuk Anda (dan folder spam) untuk melanjutkan.
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
                <Button variant="link" className="p-0 h-auto text-xs" onClick={handleResendVerification} disabled={isSending}>
                    {isSending ? "Mengirim..." : "Kirim ulang"}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

