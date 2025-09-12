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
  stage: number;
};

type ScoresByStage = {
  1?: number;
  2?: number;
  3?: number;
};

export function TeacherDashboard({ user, userProfile, onSectionChange }: TeacherDashboardProps) {
  const [allStudents, setAllStudents] = useState<UserProfile[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<DetailedScoreEntry[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [managedGames, setManagedGames] = useState<ManagedGame[]>([]);

  const gameToStageMap = useMemo(() => {
    const map = new Map<string, number>();
    managedGames.forEach(game => {
      map.set(game.name, game.stage);
    });
    return map;
  }, [managedGames]);

  useEffect(() => {
    setIsLoading(true);
    const studentsQuery = query(collection(db, "users"), where("peran", "==", "student"));
    const submissionsQuery = query(collection(db, "gameSubmissions"), orderBy("createdAt", "desc"));
    const gamesQuery = query(collection(db, "managedGames"), orderBy("stage", "asc"));

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

  const getStudentScoresByStage = (studentId: string): ScoresByStage => {
    const scores: ScoresByStage = {};
    const studentSubmissions = filteredSubmissions.filter(s => s.userId === studentId);

    studentSubmissions.forEach(sub => {
      const stage = gameToStageMap.get(sub.game);
      if (stage) {
        if (!scores[stage] || sub.score > scores[stage]!) {
          scores[stage] = Number(sub.score || 0);
        }
      }
    });
    return scores;
  };

  const calculateTotalScore = (scores: ScoresByStage) => {
    return Object.values(scores).reduce((total, score) => total + (score || 0), 0);
  };

  const classScoreAverages = useMemo(() => {
    const totals = { 1: 0, 2: 0, 3: 0 };
    const counts = { 1: 0, 2: 0, 3: 0 };

    filteredStudents.forEach(student => {
      const scores = getStudentScoresByStage(student.uid);
      if (scores[1]) { totals[1] += scores[1]; counts[1]++; }
      if (scores[2]) { totals[2] += scores[2]; counts[2]++; }
      if (scores[3]) { totals[3] += scores[3]; counts[3]++; }
    });

    return {
      stage1: counts[1] > 0 ? (totals[1] / counts[1]).toFixed(1) : '-',
      stage2: counts[2] > 0 ? (totals[2] / counts[2]).toFixed(1) : '-',
      stage3: counts[3] > 0 ? (totals[3] / counts[3]).toFixed(1) : '-',
    };
  }, [filteredStudents, filteredSubmissions, gameToStageMap]);

  const studentRankingData = useMemo(() => {
    return filteredStudents
      .map(student => ({
        name: student.namaLengkap.split(' ')[0],
        totalScore: calculateTotalScore(getStudentScoresByStage(student.uid)),
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 10);
  }, [filteredStudents, filteredSubmissions, gameToStageMap]);

  const participationData = useMemo(() => {
    const studentIdsWithSubmissions = new Set(filteredSubmissions.map(sub => sub.userId));
    const didSubmitCount = filteredStudents.filter(student => studentIdsWithSubmissions.has(student.uid)).length;
    const didNotSubmitCount = filteredStudents.length - didSubmitCount;
    return [
      { name: 'Sudah Mengerjakan', value: didSubmitCount },
      { name: 'Belum Mengerjakan', value: didNotSubmitCount },
    ];
  }, [filteredStudents, filteredSubmissions]);

  // --- LOGIKA DISESUAIKAN: Skala 1-10 ---
  const scoreDistributionData = useMemo(() => {
    const distribution = {
      'Stage 1': { 'Remedial (0-5)': 0, 'Cukup (6-7)': 0, 'Baik (8-9)': 0, 'Sangat Baik (10)': 0 },
      'Stage 2': { 'Remedial (0-5)': 0, 'Cukup (6-7)': 0, 'Baik (8-9)': 0, 'Sangat Baik (10)': 0 },
      'Stage 3': { 'Remedial (0-5)': 0, 'Cukup (6-7)': 0, 'Baik (8-9)': 0, 'Sangat Baik (10)': 0 },
    };

    const studentScores = new Map<string, ScoresByStage>();
    filteredStudents.forEach(student => {
      studentScores.set(student.uid, getStudentScoresByStage(student.uid));
    });

    studentScores.forEach(scores => {
      Object.entries(scores).forEach(([stage, score]) => {
        const stageName = `Stage ${stage}`;
        if (score === 10) distribution[stageName]['Sangat Baik (10)']++;
        else if (score >= 8) distribution[stageName]['Baik (8-9)']++;
        else if (score >= 6) distribution[stageName]['Cukup (6-7)']++;
        else distribution[stageName]['Remedial (0-5)']++;
      });
    });

    return [
      { name: 'Stage 1', ...distribution['Stage 1'] },
      { name: 'Stage 2', ...distribution['Stage 2'] },
      { name: 'Stage 3', ...distribution['Stage 3'] },
    ];

  }, [filteredStudents, filteredSubmissions, gameToStageMap]);
  // --- SELESAI PENYESUAIAN ---

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
    const mostActiveStudentData = filteredStudents.find(s => s.uid === mostActiveUserId);

    return {
      overallAverage,
      totalSubmissions: filteredSubmissions.length,
      highestScore,
      mostActiveStudent: mostActiveStudentData?.namaLengkap || 'N/A',
    };
  }, [filteredSubmissions, filteredStudents]);

  const COLORS = ['#0ea5e9', '#e5e7eb'];
  const SCORE_COLORS = ['#ef4444', '#f97316', '#84cc16', '#22c55e'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-6 sm:px-6 lg:px-8 py-2 space-y-8">
      <div className="flex items-center justify-between px-4">
        <div>
          <h1 className="text-3xl font-bold mt-2">Dashboard Guru</h1>
          <p className="text-gray-800 text-lg">Selamat datang, {userProfile.namaLengkap}</p>
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
          <CardDescription>Daftar lengkap siswa beserta skor per stage di kelas ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-full overflow-y-auto border rounded-lg">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-10 bg-gray-100">
                <TableRow>
                  <TableHead className="w-[40%]">Nama Siswa</TableHead>
                  <TableHead className="w-[30%]">Email</TableHead>
                  <TableHead className="w-[10%] text-center">Stage 1</TableHead>
                  <TableHead className="w-[10%] text-center">Stage 2</TableHead>
                  <TableHead className="w-[10%] text-center">Stage 3</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const scores = getStudentScoresByStage(student.uid);
                    return (
                      <TableRow key={student.uid}>
                        <TableCell className="font-medium truncate" title={student.namaLengkap}>
                          {student.namaLengkap}
                        </TableCell>
                        <TableCell className="truncate" title={student.email}>
                          {student.email}
                        </TableCell>
                        <TableCell className="text-center font-medium text-primary">
                          {scores[1] ?? '-'}
                        </TableCell>
                        <TableCell className="text-center font-medium text-primary">
                          {scores[2] ?? '-'}
                        </TableCell>
                        <TableCell className="text-center font-medium text-primary">
                          {scores[3] ?? '-'}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                      Tidak ada siswa yang ditemukan untuk kelas ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="bg-gray-100 font-bold sticky bottom-0">
                <TableRow>
                  <TableCell colSpan={2} className="text-left">Rata-rata Kelas</TableCell>
                  <TableCell className="text-center">{classScoreAverages.stage1}</TableCell>
                  <TableCell className="text-center">{classScoreAverages.stage2}</TableCell>
                  <TableCell className="text-center">{classScoreAverages.stage3}</TableCell>
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

            {/* --- CHART DISESUAIKAN: Skala 1-10 --- */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookCheck className="h-5 w-5 text-primary" /> Distribusi Skor per Stage</CardTitle>
                <CardDescription>Jumlah siswa berdasarkan kategori skor di setiap stage.</CardDescription>
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
            {/* --- SELESAI --- */}

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