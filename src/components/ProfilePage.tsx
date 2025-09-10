import { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { UserProfile, updateUserProfileData, sendPasswordReset } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { User, Mail, Shield, Trash2, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../components/ui/badge";

interface ProfilePageProps {
  user: FirebaseUser;
  userProfile: UserProfile;
  onProfileUpdate: () => Promise<void>;
}

export default function ProfilePage({
  user,
  userProfile,
  onProfileUpdate,
}: ProfilePageProps) {
  const [namaLengkap, setNamaLengkap] = useState(userProfile.namaLengkap);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (namaLengkap.trim() === "") {
      toast.error("Nama lengkap tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    const { success, error } = await updateUserProfileData(user.uid, {
      namaLengkap,
    });

    setIsLoading(false);
    if (success) {
      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
      await onProfileUpdate(); // refresh profil di App.tsx
    } else {
      toast.error("Gagal memperbarui profil", { description: error });
    }
  };

  const handlePasswordChange = async () => {
    if (!user.email) {
        toast.error("Email pengguna tidak ditemukan untuk mengirim tautan reset.");
        return;
    }
    setIsSendingReset(true);
    const { success, error } = await sendPasswordReset(user.email);
    setIsSendingReset(false);

    if (success) {
        toast.success("Tautan reset password telah dikirim!", {
            description: "Silakan periksa kotak masuk email Anda untuk melanjutkan."
        });
    } else {
        toast.error("Gagal mengirim tautan", { description: error });
    }
  };


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-foreground">Profil Saya</h1>
      </div>

      {/* Profil Card */}
      <Card>
        <CardHeader className="flex flex-col items-center text-center space-y-4">
          <div>
            <CardTitle className="text-3xl">{namaLengkap}</CardTitle>

            {userProfile.kelasIds && (
              <p className="text-muted-foreground text-md mt-2">
                {userProfile.kelasIds}
              </p>
            )}

            <CardDescription className="flex items-center gap-2 justify-center">
              <Mail className="w-4 h-4" />
              {userProfile.email}
            </CardDescription>

          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="namaLengkap">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="namaLengkap"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  className="pl-10"
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  value={userProfile.email}
                  disabled
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setNamaLengkap(userProfile.namaLengkap);
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  Edit Profil
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Keamanan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" /> Keamanan
          </CardTitle>
          <CardDescription>
            Ubah kata sandi Anda secara berkala untuk menjaga keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handlePasswordChange} disabled={isSendingReset}>
             {isSendingReset ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : (
                "Ubah Kata Sandi"
              )}
          </Button>
        </CardContent>
      </Card>

      {/* Zona Berbahaya */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <Trash2 className="w-5 h-5 mr-2" /> Zona Berbahaya
          </CardTitle>
          <CardDescription>
            Tindakan ini tidak dapat diurungkan. Harap berhati-hati.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Hapus Akun</Button>
        </CardContent>
      </Card>
    </div>
  );
}

