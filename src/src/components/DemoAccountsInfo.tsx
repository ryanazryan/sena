import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, GraduationCap } from "lucide-react";

export function DemoAccountsInfo() {
  const demoAccounts = {
    students: [
      { name: 'Andi Pratama', email: 'andi.siswa@gmail.com', grade: 'Kelas 5', school: 'SDN 1 Malang' },
      { name: 'Sari Dewi', email: 'sari.siswa@gmail.com', grade: 'Kelas 4', school: 'SDN 2 Malang' },
      { name: 'Budi Santoso', email: 'budi.siswa@gmail.com', grade: 'Kelas 6', school: 'SDN 3 Malang' }
    ],
    teachers: [
      { name: 'Ahmad Wijaya, S.Pd', email: 'pak.ahmad@sdn1malang.sch.id', subject: 'Matematika', nip: '196803141989031007' },
      { name: 'Siti Nurhaliza, S.Pd', email: 'bu.siti@sdn2malang.sch.id', subject: 'Bahasa Indonesia', nip: '197205091998032005' },
      { name: 'Rizki Rahman, S.Pd', email: 'pak.rizki@sdn3malang.sch.id', subject: 'IPA', nip: '198109152005011003' }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🎮 Demo Accounts SENA</h2>
            <p className="text-gray-600">Gunakan akun demo di bawah untuk mencoba fitur platform SENA</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-teal-500" />
                  <span>Akun Siswa</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoAccounts.students.map((student, index) => (
                  <div key={index} className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="font-medium text-teal-900">{student.name}</div>
                    <div className="text-sm text-teal-700">{student.email}</div>
                    <div className="text-xs text-teal-600">{student.grade} - {student.school}</div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Password:</span> <span className="font-mono">siswa123</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Accounts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-500" />
                  <span>Akun Guru</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoAccounts.teachers.map((teacher, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900">{teacher.name}</div>
                    <div className="text-sm text-blue-700">{teacher.email}</div>
                    <div className="text-xs text-blue-600">Guru {teacher.subject} - NIP: {teacher.nip}</div>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Password:</span> <span className="font-mono">guru123</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Pilih salah satu akun di atas, lalu klik tombol "Login" di header untuk masuk ke sistem.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">📚 Akses materi pembelajaran</span>
              <span className="bg-gray-100 px-2 py-1 rounded">🎮 Main game edukasi</span>
              <span className="bg-gray-100 px-2 py-1 rounded">📊 Lihat progress belajar</span>
              <span className="bg-gray-100 px-2 py-1 rounded">👥 Kelola kelas (guru)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}