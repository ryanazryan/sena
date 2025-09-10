import { useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { updateUserClass } from "../lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface CompleteProfilePageProps {
  user: FirebaseUser;
  onProfileComplete: () => Promise<void>;
}

export default function CompleteProfilePage({
  user,
  onProfileComplete,
}: CompleteProfilePageProps) {
  const [kelas, setKelas] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kelas.trim() === "") {
      toast.error("Anda harus memilih kelas.");
      return;
    }

    setIsLoading(true);
    const { success, error } = await updateUserClass(user.uid, kelas);
    setIsLoading(false);

    if (success) {
      toast.success("Profil berhasil dilengkapi!", {
        description: "Anda sekarang dapat mengakses dasbor.",
      });
      await onProfileComplete();
    } else {
      toast.error("Gagal menyimpan data", {
        description: error || "Terjadi kesalahan yang tidak diketahui.",
      });
    }
  };

  return (
    <div className=" flex justify-center bg-background px-4 mt-6 mb-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center mt-2">
            Lengkapi Profil Anda
          </CardTitle>
          <CardDescription className="text-center">
            Satu langkah lagi! Silakan pilih kelas Anda untuk melanjutkan.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email || ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="namaLengkap">Nama Lengkap</Label>
                <Input
                  id="namaLengkap"
                  value={user.displayName || "Pengguna"}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kelas">Kelas Anda</Label>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoading ? "Menyimpan..." : "Simpan dan Lanjutkan"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

