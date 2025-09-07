import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { GraduationCap, Trophy, Users, Plus, Check, Loader2 } from "lucide-react";
import { nanoid } from 'nanoid';
import { UserProfile } from "../lib/auth"; // PERBAIKAN: Import UserProfile dari auth.ts
import { ScoreEntry } from "../App"; // Import ScoreEntry dari App.tsx
import { toast } from "sonner";

type TeacherDashboardProps = {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
};

export function TeacherDashboard({ user, userProfile, onSectionChange }: TeacherDashboardProps) {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [submissions, setSubmissions] = useState<ScoreEntry[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  // Ambil daftar kelas yang dibuat oleh guru
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "classes"),
      where("teacherId", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const teacherClasses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClasses(teacherClasses);
      if (teacherClasses.length > 0 && !selectedClass) {
        setSelectedClass(teacherClasses[0]);
      }
    });
    return () => unsubscribe();
  }, [user, selectedClass]);

  // Ambil daftar siswa dan nilai berdasarkan kelas yang dipilih
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      setSubmissions([]);
      return;
    }

    const studentsQ = query(
      collection(db, "users"),
      where("kodeKelas", "==", selectedClass.classCode)
    );
    const submissionsQ = query(
        collection(db, "gameSubmissions"),
        where("kodeKelas", "==", selectedClass.classCode)
    );

    const unsubscribeStudents = onSnapshot(studentsQ, (querySnapshot) => {
        const studentsData = querySnapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data()
        })) as unknown as UserProfile[];
        setStudents(studentsData);
    });

    const unsubscribeSubmissions = onSnapshot(submissionsQ, (querySnapshot) => {
        const submissionsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as unknown as ScoreEntry[];
        setSubmissions(submissionsData);
    });

    return () => {
        unsubscribeStudents();
        unsubscribeSubmissions();
    };
  }, [selectedClass]);

  const handleCreateClass = async () => {
    if (newClassName.trim() === "") {
      toast.error("Nama kelas tidak boleh kosong.");
      return;
    }
    setIsCreatingClass(true);
    try {
      const newClassCode = nanoid(8).toUpperCase();
      await addDoc(collection(db, "classes"), {
        className: newClassName,
        classCode: newClassCode,
        teacherId: user.uid,
        teacherName: userProfile.namaLengkap,
        createdAt: serverTimestamp(),
      });
      setNewClassName("");
      setIsDialogOpen(false);
      toast.success("Kelas berhasil dibuat!");
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Gagal membuat kelas.");
    } finally {
      setIsCreatingClass(false);
    }
  };

  const getStudentScores = (studentId: string) => {
      return submissions.filter(s => s.userId === studentId).map(s => s.score);
  };

  return (
    <div className="flex-1 space-y-8 bg-gray-950 text-white">
      {/* Header Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Guru</h1>
          <p className="text-gray-400">Kelola kelas dan pantau kemajuan siswa.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Buat Kode Kelas
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Buat Kode Kelas Baru</DialogTitle>
              <DialogDescription className="text-gray-400">
                Masukkan nama kelas untuk menghasilkan kode unik.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="className" className="text-right text-gray-300">
                  Nama Kelas
                </Label>
                <Input
                  id="className"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="col-span-3 bg-gray-800 text-white border-gray-700"
                  placeholder="Contoh: Kelas 7A"
                  disabled={isCreatingClass}
                />
              </div>
            </div>
            <Button onClick={handleCreateClass} className="w-full bg-teal-600 hover:bg-teal-700" disabled={isCreatingClass}>
              {isCreatingClass ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {isCreatingClass ? "Membuat Kelas..." : "Buat Kode"}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Class List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Daftar Kelas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <Card
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className={`bg-gray-800 border-2 border-transparent transition-all cursor-pointer hover:border-teal-500 hover:bg-gray-700 ${
                  selectedClass?.id === cls.id ? "border-teal-500 shadow-lg" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-teal-400" />
                    {cls.className}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Kode: <span className="font-mono font-semibold">{cls.classCode}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 md:col-span-3">Anda belum memiliki kelas. Buat kelas baru untuk memulai!</p>
          )}
        </div>
      </div>

      {selectedClass && (
        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-400" />
              Daftar Siswa: {selectedClass.className}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Terdapat {students.length} siswa dalam kelas ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Nama Siswa</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Total Nilai Game</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <TableRow key={student.uid} className="border-gray-700">
                      <TableCell className="font-medium text-white">
                        {student.namaLengkap}
                      </TableCell>
                      <TableCell className="text-gray-300">{student.email}</TableCell>
                      <TableCell className="text-gray-300">
                        {getStudentScores(student.uid).reduce((sum, current) => sum + current, 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      Belum ada siswa yang bergabung dengan kelas ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}