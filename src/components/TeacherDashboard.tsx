// File: src/components/TeacherDashboard.tsx

import { useState, useEffect, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Users, Loader2, BarChart, PieChart, LineChart, Trophy, ListChecks, Target, Eye } from "lucide-react";
import { UserProfile } from "../lib/auth";
import { ScoreEntry } from "../App";
import { Badge } from "./ui/badge";
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Pie,
  Cell,
  Line,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  LineChart as RechartsLineChart
} from 'recharts';

type TeacherDashboardProps = {
  user: FirebaseUser;
  userProfile: UserProfile;
  onSectionChange: (section: string) => void;
};

interface DetailedScoreEntry extends ScoreEntry {
  id: string;
  createdAt: Timestamp;
}

export function TeacherDashboard({ user, userProfile, onSectionChange }: TeacherDashboardProps) {
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<DetailedScoreEntry[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const studentsQuery = query(collection(db, "users"), where("peran", "==", "student"));
    const submissionsQuery = query(collection(db, "gameSubmissions"));

    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
      setAllStudents(studentsData);
    });

    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DetailedScoreEntry[];
      setAllSubmissions(submissionsData);
    });

    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      unsubscribeStudents();
      unsubscribeSubmissions();
      clearTimeout(timer);
    };
  }, []);

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
      if (!selectedClass && sortedClasses.length > 0) {
        setSelectedClass(sortedClasses[0]);
      }
    }
  }, [allStudents, selectedClass]);

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
      .reduce((total, sub) => total + Number(sub.score || 0), 0);
  };


  const studentRankingData = useMemo(() => {
    return filteredStudents
      .map(student => ({
        name: student.namaLengkap.split(' ')[0],
        totalScore: getStudentTotalScore(student.uid),
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  }, [filteredStudents, filteredSubmissions]);

  const participationData = useMemo(() => {
    const studentIdsWithSubmissions = new Set(filteredSubmissions.map(sub => sub.userId));
    const didSubmitCount = filteredStudents.filter(student => studentIdsWithSubmissions.has(student.uid)).length;
    const didNotSubmitCount = filteredStudents.length - didSubmitCount;
    return [
      { name: 'Sudah Mengerjakan', value: didSubmitCount },
      { name: 'Belum Mengerjakan', value: didNotSubmitCount },
    ];
  }, [filteredStudents, filteredSubmissions]);

  const studentsWithSubmissions = useMemo(() => {
    return new Set(filteredSubmissions.map(sub => sub.userId));
}, [filteredSubmissions]);

  const classProgressData = useMemo(() => {
    if (!filteredSubmissions.length) return [];
    const submissionsByDate = filteredSubmissions.reduce((acc, sub) => {
      if (!sub.createdAt?.toDate) return acc;
      const date = sub.createdAt.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      if (!acc[date]) acc[date] = [];
      acc[date].push(Number(sub.score || 0));
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(submissionsByDate)
      .map(([date, scores]) => ({
        date,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-')).getTime();
        const dateB = new Date(b.date.split('/').reverse().join('-')).getTime();
        return dateA - dateB;
      });
  }, [filteredSubmissions]);

  const classSummaryStats = useMemo(() => {
    if (filteredSubmissions.length === 0) {
      return { overallAverage: 0, totalSubmissions: 0, highestScore: 0, mostActiveStudent: 'N/A' };
    }

    const overallAverage = Math.round(
      filteredSubmissions.reduce((acc, sub) => acc + Number(sub.score || 0), 0) / filteredSubmissions.length
    );

    const highestScore = Math.max(...filteredSubmissions.map(sub => Number(sub.score || 0)));

    const submissionCounts = filteredSubmissions.reduce((acc, sub) => {
      acc[sub.userId] = (acc[sub.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostActiveUserId = Object.keys(submissionCounts).reduce((a, b) => submissionCounts[a] > submissionCounts[b] ? a : b, '');
    const mostActiveStudentData = filteredStudents.find(s => s.uid === mostActiveUserId);

    return {
      overallAverage,
      totalSubmissions: filteredSubmissions.length,
      highestScore,
      mostActiveStudent: mostActiveStudentData?.namaLengkap || 'N/A',
    };
  }, [filteredSubmissions, filteredStudents]);


  const COLORS = ['#0ea5e9', '#e5e7eb'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-5 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Guru</h1>
          <p className="text-gray-600">Selamat datang, {userProfile.namaLengkap}!</p>
        </div>
      </div>

      <div className="px-3 sm:px-3">
        <h2 className="text-xl font-semibold mb-3">Pilih Kelas</h2>
        <div className="flex flex-wrap gap-2">
          {availableClasses.map((className) => (
            <Button
              key={className}
              variant={selectedClass === className ? "default" : "outline"}
              onClick={() => setSelectedClass(className)}
            >
              {className}
            </Button>
          ))}
        </div>
      </div>
      <Card>
    <CardHeader>
        <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Users className="h-6 w-6 text-primary" /> Daftar Siswa: {selectedClass}</div>
            <Badge variant="secondary">{filteredStudents.length} Siswa</Badge>
        </CardTitle>
        <CardDescription>Daftar lengkap siswa beserta total skor di kelas ini.</CardDescription>
    </CardHeader>
    <CardContent>
        <div className="relative max-h-full overflow-y-auto border rounded-lg">
            <Table className="table-fixed w-full">
                <TableHeader className="sticky top-0 z-10 bg-gray-100">
                    <TableRow>
                        <TableHead className="w-[40%]">Nama Siswa</TableHead>
                        <TableHead className="w-[30%]">Email</TableHead>
                        <TableHead className="w-[20%] text-right">Status / Skor</TableHead> 
                        <TableHead className="w-[10%] text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <TableRow key={student.uid}>
                                <TableCell className="font-medium truncate" title={student.namaLengkap}>
                                    {student.namaLengkap}
                                </TableCell>
                                <TableCell className="truncate" title={student.email}>
                                    {student.email}
                                </TableCell>

                                <TableCell className="text-right">
                                    {(() => {
                                        if (studentsWithSubmissions.has(student.uid)) {
                                            const totalScore = getStudentTotalScore(student.uid);
                                            
                                            if (totalScore > 0) {
                                                return (
                                                    <span className="font-semibold text-primary">
                                                        {totalScore}
                                                    </span>
                                                );
                                            } else {
                                                return (
                                                    <span className="text-sm text-yellow-600 font-medium italic">
                                                        Belum dinilai
                                                    </span>
                                                );
                                            }
                                        } else {
                                            return (
                                                <span className="text-sm text-gray-500 italic">
                                                    Belum mengerjakan
                                                </span>
                                            );
                                        }
                                    })()}
                                </TableCell>

                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setIsDetailModalOpen(true);
                                        }}
                                    >
                                        <Eye className="h-5 w-5 text-gray-600" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                                Tidak ada siswa yang ditemukan untuk kelas ini.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    </CardContent>
</Card>

      {selectedClass && (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5 text-primary" /> Peringkat Siswa</CardTitle>
                <CardDescription>10 siswa dengan skor total tertinggi di kelas {selectedClass}.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={studentRankingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalScore" name="Total Skor" fill="#3b82f6" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5 text-primary" /> Partisipasi Siswa</CardTitle>
                <CardDescription>Persentase siswa yang aktif mengerjakan.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie data={participationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {participationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* --- PERUBAHAN TATA LETAK DI SINI --- */}

            <Card className="lg:col-span-2"> {/* Diubah dari col-span-3 menjadi 2 */}
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LineChart className="h-5 w-5 text-primary" /> Progres Rata-rata Kelas</CardTitle>
                <CardDescription>Tren skor rata-rata harian di kelas {selectedClass}.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={classProgressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="averageScore" name="Rata-rata Skor" stroke="#16a34a" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* --- BARU: Kartu Ringkasan Kelas --- */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Ringkasan Kelas</CardTitle>
                <CardDescription>Statistik penting untuk kelas {selectedClass}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                  <p className="text-sm font-medium text-gray-600">Skor Rata-rata Kelas</p>
                  <p className="text-lg font-bold text-primary">{classSummaryStats.overallAverage}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                  <p className="text-sm font-medium text-gray-600">Total Submission</p>
                  <p className="text-lg font-bold text-primary">{classSummaryStats.totalSubmissions}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                  <p className="text-sm font-medium text-gray-600">Skor Tertinggi</p>
                  <p className="text-lg font-bold text-primary">{classSummaryStats.highestScore}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100">
                  <p className="text-sm font-medium text-gray-600">Siswa Teraktif</p>
                  <p className="text-sm font-bold text-primary truncate">{classSummaryStats.mostActiveStudent}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}