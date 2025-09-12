// File: src/components/TeacherDashboard.tsx

import { useState, useEffect, useMemo } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { collection, query, where, onSnapshot, Timestamp, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "./ui/table";
import { Button } from "./ui/button";
import { Users, Loader2, BarChart, PieChart, ListChecks, BookCheck } from "lucide-react";
import { UserProfile } from "../lib/auth";
import { ScoreEntry } from "./GamesSection";
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
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
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

type ManagedGame = {
  id: string;
  name: string;
  level: number;
};

type ScoresByLevel = {
  [key: number]: number;
};

export function TeacherDashboard({ user, userProfile, onSectionChange }: TeacherDashboardProps) {
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<DetailedScoreEntry[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [managedGames, setManagedGames] = useState<ManagedGame[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const studentsQuery = query(collection(db, "users"), where("peran", "==", "student"));
    const submissionsQuery = query(collection(db, "gameSubmissions"), orderBy("createdAt", "desc"));
    const gamesQuery = query(collection(db, "managedGames"), orderBy("level", "asc"));

    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const studentsData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as UserProfile[];
      setAllStudents(studentsData);
    });

    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      const submissionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DetailedScoreEntry[];
      setAllSubmissions(submissionsData);
    });

    const unsubscribeGames = onSnapshot(gamesQuery, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setManagedGames(gamesData);
    });

    const timer = setTimeout(() => setIsLoading(false), 1500);

    return () => {
      unsubscribeStudents();
      unsubscribeSubmissions();
      unsubscribeGames();
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
    const studentsInClass = allStudents.filter(student => student.kelasIds?.includes(selectedClass));
    const studentIdsInClass = new Set(studentsInClass.map(s => s.uid));
    const submissionsFromClass = allSubmissions.filter(sub => studentIdsInClass.has(sub.userId));
    return {
      filteredStudents: studentsInClass,
      filteredSubmissions: submissionsFromClass,
    };
  }, [selectedClass, allStudents, allSubmissions]);

  const getStudentScoresByLevel = (studentId: string): ScoresByLevel => {
    const scores: ScoresByLevel = {};
    const studentSubmissions = filteredSubmissions.filter(s => s.userId === studentId);
    studentSubmissions.forEach(sub => {
      const level = sub.level; // Mengambil level langsung dari data submission
      if (level !== undefined) {
        if (!scores[level] || sub.score > scores[level]) {
          scores[level] = Number(sub.score || 0);
        }
      }
    });
    return scores;
  };

  const calculateTotalScore = (scores: ScoresByLevel) => {
    return Object.values(scores).reduce((total, score) => total + (score || 0), 0);
  };

  const classScoreAverages = useMemo(() => {
    const totals: { [key: number]: number } = {};
    const counts: { [key: number]: number } = {};
    filteredStudents.forEach(student => {
      const scores = getStudentScoresByLevel(student.uid);
      Object.entries(scores).forEach(([level, score]) => {
        const levelNum = parseInt(level);
        if(!totals[levelNum]) totals[levelNum] = 0;
        if(!counts[levelNum]) counts[levelNum] = 0;
        totals[levelNum] += score;
        counts[levelNum]++;
      });
    });
    const averages: { [key: string]: string } = {};
    Object.keys(totals).forEach(level => {
        averages[`level${level}`] = (totals[parseInt(level)] / counts[parseInt(level)]).toFixed(1);
    });
    return averages;
  }, [filteredStudents, filteredSubmissions]);
  
  const studentRankingData = useMemo(() => {
    return filteredStudents.map(student => ({
        name: student.namaLengkap.split(' ')[0],
        totalScore: calculateTotalScore(getStudentScoresByLevel(student.uid)),
      })).sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
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
  
  const scoreDistributionData = useMemo(() => {
    const distribution: { [key: string]: { [key: string]: number } } = {};
    const availableLevels = Array.from(new Set(managedGames.map(g => g.level))).sort((a,b) => a-b);
    availableLevels.forEach(level => {
        distribution[`Level ${level}`] = { 'Remedial (0-5)': 0, 'Cukup (6-7)': 0, 'Baik (8-9)': 0, 'Sangat Baik (10)': 0 };
    });
    filteredSubmissions.forEach(sub => {
        const level = sub.level;
        if (level !== undefined && distribution[`Level ${level}`]) {
            const levelName = `Level ${level}`;
            const score = Number(sub.score || 0);
            if (score === 10) distribution[levelName]['Sangat Baik (10)']++;
            else if (score >= 8) distribution[levelName]['Baik (8-9)']++;
            else if (score >= 6) distribution[levelName]['Cukup (6-7)']++;
            else distribution[levelName]['Remedial (0-5)']++;
        }
    });
    return Object.entries(distribution).map(([name, data]) => ({ name, ...data }));
  }, [filteredSubmissions, managedGames]);

  const classSummaryStats = useMemo(() => {
    if (filteredSubmissions.length === 0) {
      return { overallAverage: 0, totalSubmissions: 0, highestScore: 0, mostActiveStudent: 'N/A' };
    }
    const totalScores = filteredSubmissions.map(sub => Number(sub.score || 0));
    const overallAverage = (totalScores.reduce((acc, score) => acc + score, 0) / totalScores.length).toFixed(1);
    const highestScore = Math.max(...totalScores);
    const submissionCounts = filteredSubmissions.reduce((acc, sub) => {
      acc[sub.userId] = (acc[sub.userId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostActiveUserId = Object.keys(submissionCounts).length > 0 ? Object.keys(submissionCounts).reduce((a, b) => submissionCounts[a] > submissionCounts[b] ? a : b) : '';
    const mostActiveStudentData = allStudents.find(s => s.uid === mostActiveUserId);
    return {
      overallAverage,
      totalSubmissions: filteredSubmissions.length,
      highestScore,
      mostActiveStudent: mostActiveStudentData?.namaLengkap || 'N/A',
    };
  }, [filteredSubmissions, allStudents]);
  
  const COLORS = ['#0ea5e9', '#e5e7eb'];
  const SCORE_COLORS = ['#ef4444', '#f97316', '#84cc16', '#22c55e'];
  
  const availableLevels = useMemo(() => {
    if (managedGames.length === 0) return [];
    const levelSet = new Set(managedGames.map(game => game.level));
    return Array.from(levelSet).sort((a, b) => a - b);
  }, [managedGames]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        <p className="text-muted-foreground text-lg">Selamat datang, {userProfile.namaLengkap}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-3">Pilih Kelas</h2>
        <div className="flex flex-wrap gap-2">
          {availableClasses.map((className) => (
            <Button key={className} variant={selectedClass === className ? "default" : "outline"} onClick={() => setSelectedClass(className)}>
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
          <CardDescription>Daftar lengkap siswa beserta skor per level di kelas ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-[600px] overflow-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                <TableRow>
                  <TableHead className="w-[40%]">Nama Siswa</TableHead>
                  <TableHead className="w-[30%]">Email</TableHead>
                  {availableLevels.map(level => (
                    <TableHead key={level} className="w-[10%] text-center">Level {level}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const scores = getStudentScoresByLevel(student.uid);
                    return (
                      <TableRow key={student.uid}>
                        <TableCell className="font-medium truncate" title={student.namaLengkap}>{student.namaLengkap}</TableCell>
                        <TableCell className="truncate" title={student.email}>{student.email}</TableCell>
                        {availableLevels.map(level => (
                          <TableCell key={level} className="text-center font-medium text-primary">
                            {scores[level] ?? '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow><TableCell colSpan={2 + availableLevels.length} className="text-center text-muted-foreground py-8">Tidak ada siswa.</TableCell></TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-muted font-bold sticky bottom-0">
                <TableRow>
                  <TableCell colSpan={2} className="text-left">Rata-rata Kelas</TableCell>
                  {availableLevels.map(level => (
                    <TableCell key={level} className="text-center">
                      {classScoreAverages[`level${level}`] || '-'}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
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

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookCheck className="h-5 w-5 text-primary" /> Distribusi Skor per Level</CardTitle>
                <CardDescription>Jumlah siswa berdasarkan kategori skor di setiap level.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={scoreDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Remedial (0-5)" stackId="a" fill={SCORE_COLORS[0]} />
                    <Bar dataKey="Cukup (6-7)" stackId="a" fill={SCORE_COLORS[1]} />
                    <Bar dataKey="Baik (8-9)" stackId="a" fill={SCORE_COLORS[2]} />
                    <Bar dataKey="Sangat Baik (10)" stackId="a" fill={SCORE_COLORS[3]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Ringkasan Kelas</CardTitle>
                <CardDescription>Statistik penting untuk kelas {selectedClass}.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">Skor Rata-rata Kelas</p>
                  <p className="text-lg font-bold text-primary">{classSummaryStats.overallAverage}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">Total Submission</p>
                  <p className="text-lg font-bold text-primary">{classSummaryStats.totalSubmissions}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">Skor Tertinggi</p>
                  <p className="text-lg font-bold text-primary">{classSummaryStats.highestScore}</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-muted-foreground">Siswa Teraktif</p>
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