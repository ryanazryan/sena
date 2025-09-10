import { useState, useEffect, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
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
import { Users, Loader2 } from "lucide-react";
import { UserProfile } from "../lib/auth";
import { ScoreEntry } from "../App";
import { Badge } from "./ui/badge";

type TeacherDashboardProps = {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
};

export function TeacherDashboard({ user, userProfile, onSectionChange }: TeacherDashboardProps) {
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<ScoreEntry[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Ambil semua data siswa dan semua data submission
  useEffect(() => {
    setIsLoading(true);
    const studentsQuery = query(collection(db, "users"), where("peran", "==", "student"));
    const submissionsQuery = query(collection(db, "gameSubmissions"));

    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
      setAllStudents(studentsData);
    });

    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ScoreEntry[];
      setAllSubmissions(submissionsData);
    });

    // Hentikan loading setelah beberapa saat (asumsi data sudah termuat)
    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      unsubscribeStudents();
      unsubscribeSubmissions();
      clearTimeout(timer);
    };
  }, []);

  // 2. Proses data untuk mendapatkan daftar kelas unik
  useEffect(() => {
    if (allStudents.length > 0) {
      const classSet = new Set<string>();
      allStudents.forEach(student => {
        if (student.kelasIds && student.kelasIds.length > 0) {
          classSet.add(student.kelasIds[0]);
        }
      });
      const sortedClasses = Array.from(classSet).sort();
      setAvailableClasses(sortedClasses);
      // Otomatis pilih kelas pertama jika belum ada yang dipilih
      if (!selectedClass && sortedClasses.length > 0) {
        setSelectedClass(sortedClasses[0]);
      }
    }
  }, [allStudents, selectedClass]);

  // 3. Memoize (optimasi) data yang akan ditampilkan berdasarkan kelas yang dipilih
  const { filteredStudents, filteredSubmissions } = useMemo(() => {
    if (!selectedClass) {
      return { filteredStudents: [], filteredSubmissions: [] };
    }

    const studentsInClass = allStudents.filter(
      student => student.kelasIds?.includes(selectedClass)
    );

    const studentIdsInClass = new Set(studentsInClass.map(s => s.uid));

    const submissionsFromClass = allSubmissions.filter(sub =>
      studentIdsInClass.has(sub.userId)
    );

    return {
      filteredStudents: studentsInClass,
      filteredSubmissions: submissionsFromClass,
    };
  }, [selectedClass, allStudents, allSubmissions]);
  
  const getStudentTotalScore = (studentId: string) => {
    return filteredSubmissions
      .filter(s => s.userId === studentId)
      .reduce((total, sub) => total + sub.score, 0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gray-50 text-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Guru</h1>
          <p className="text-gray-600">Pantau kemajuan siswa berdasarkan kelas.</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Pilih Kelas</h2>
        <div className="flex flex-wrap gap-2">
          {availableClasses.length > 0 ? (
            availableClasses.map((className) => (
              <Button
                key={className}
                variant={selectedClass === className ? "default" : "outline"}
                onClick={() => setSelectedClass(className)}
              >
                {className}
              </Button>
            ))
          ) : (
            <p className="text-gray-500">Belum ada siswa yang terdaftar di kelas manapun.</p>
          )}
        </div>
      </div>

      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Daftar Siswa: {selectedClass}
              </div>
              <Badge variant="secondary">{filteredStudents.length} Siswa</Badge>
            </CardTitle>
            <CardDescription className="text-gray-500">
              Berikut adalah daftar siswa dan total skor yang terdaftar di kelas ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative max-h-[450px] overflow-y-auto border rounded-lg">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-gray-100">
                  <TableRow>
                    <TableHead>Nama Siswa</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Total Skor Game</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.uid}>
                        <TableCell className="font-medium">
                          {student.namaLengkap}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {getStudentTotalScore(student.uid)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                        Tidak ada siswa yang ditemukan untuk kelas ini.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}