import { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { UserProfile, updateUserProfileData, changePassword, deleteUserAccount } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

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
      await onProfileUpdate();
    } else {
      toast.error("Gagal memperbarui profil", { description: error });
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error("Password baru dan konfirmasi tidak cocok.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password baru minimal harus 6 karakter.");
      return;
    }
    
    setIsChangingPassword(true);
    const { success, error } = await changePassword(oldPassword, newPassword);
    setIsChangingPassword(false);

    if (success) {
        toast.success("Password berhasil diubah!");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    } else {
        toast.error("Gagal mengubah password", { description: error });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { success, error } = await deleteUserAccount(deletePassword);
    setIsDeleting(false);

    if (success) {
      toast.success("Akun berhasil dihapus.");
    } else {
      toast.error("Gagal menghapus akun", { description: error });
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
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
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
          <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Password Lama</Label>
              <Input id="oldPassword" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Konfirmasi Password Baru</Label>
              <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
            </div>
            <Button type="submit" variant="outline" disabled={isChangingPassword}>
              {isChangingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memperbarui...</> : "Ubah Kata Sandi"}
            </Button>
          </form>
        </CardContent>
      </Card>

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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Hapus Akun</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus akun Anda dan semua data terkait secara permanen dari server kami.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <Label htmlFor="delete-password">
                  Untuk konfirmasi, masukkan password Anda:
                </Label>
                <Input
                  id="delete-password"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletePassword('')}>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deletePassword.length === 0}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Ya, Hapus Akun Saya
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}