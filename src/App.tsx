import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { getUserProfile, UserProfile, logoutUser } from "./lib/auth";

import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { VerifyEmailPage } from "./components/VerifyEmailPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { Navigation } from "./components/Navigation";
import { GamesSection } from "./components/GamesSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { Timestamp } from "firebase/firestore";
import ProfilePage from "./components/ProfilePage";
import CompleteProfilePage from "./components/CompleteProfilePage";

import { StudentDashboard } from "./components/StudentDashboard";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { AboutSection } from "./components/AboutSection";

export type ScoreEntry = {
  id: string;
  userId: string;
  studentName?: string;
  game: string;
  score: number;
  maxScore: number;
  note?: string;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'graded';
  feedback?: string;
  teacherNote?: string;
  createdAt: Timestamp;
  duration?: string;
  rank?: string;
  achievements?: string[];
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [isLoading, setIsLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState('login'); // login, register, forgotPassword

  const refreshUserProfile = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await currentUser.reload();
      setUser({ ...currentUser });

      const firestoreProfile = await getUserProfile(currentUser.uid);
      setUserProfile(firestoreProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(true);
      if (currentUser) {
        await currentUser.reload();
        setUser(currentUser);

        // --- FITUR VERIFIKASI EMAIL DINONAKTIFKAN ---
        // Pengecekan `currentUser.emailVerified` dihapus agar pengguna bisa langsung masuk
        // setelah mendaftar tanpa perlu verifikasi.
        // Untuk mengaktifkan kembali, kembalikan blok if-else di bawah ini.
        /*
        if (currentUser.emailVerified) {
          const firestoreProfile = await getUserProfile(currentUser.uid);
          setUserProfile(firestoreProfile);
        } else {
          setUserProfile(null);
        }
        */
        const firestoreProfile = await getUserProfile(currentUser.uid);
        setUserProfile(firestoreProfile);
        // --- AKHIR PERUBAHAN ---

      } else {
        setUser(null);
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setActiveSection("home");
    setAuthScreen('login');
  };

  const renderContent = () => {
    const userRole = userProfile?.peran;

    if (!userProfile || !user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (userProfile.peran === 'student' && (!userProfile.kelasIds || userProfile.kelasIds.length === 0)) {
      return (
        <CompleteProfilePage
          user={user}
          onProfileComplete={refreshUserProfile}
        />
      );
    }

    switch (activeSection) {
      case "profile":
        return <ProfilePage
          user={user}
          userProfile={userProfile}
          onProfileUpdate={refreshUserProfile}
        />;
      case "home":
        if (userRole === 'teacher') {
          return <TeacherDashboard
            user={user}
            userProfile={userProfile}
            onSectionChange={setActiveSection}
          />;
        }
        return <StudentDashboard
          user={user}
          userProfile={userProfile}
          onSectionChange={setActiveSection}
        />;
      case "games":
        return <GamesSection userRole={userRole} user={user} />;
      case "aboutus":
        return <AboutSection />;

      default:
        if (userRole === 'teacher') {
          return <TeacherDashboard
            user={user}
            userProfile={userProfile}
            onSectionChange={setActiveSection}
          />;
        }
        return <StudentDashboard
          user={user}
          userProfile={userProfile}
          onSectionChange={setActiveSection}
        />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- FITUR VERIFIKASI EMAIL DINONAKTIFKAN ---
  // Halaman verifikasi email tidak akan ditampilkan.
  // Untuk mengaktifkan kembali, hapus komentar pada blok if di bawah ini.
  /*
  if (user && !user.emailVerified) {
    return (
      <VerifyEmailPage 
        user={user} 
        onBackToLogin={async () => {
          await handleLogout();
          setAuthScreen('login');
        }} 
      />
    );
  }
  */
  // --- AKHIR PERUBAHAN ---

  if (!user) {
    switch (authScreen) {
      case 'register':
        return <RegisterPage
  onShowLogin={() => setAuthScreen('login')}
  onRegisterSuccess={refreshUserProfile}
  onBack={() => setAuthScreen('login')}
/>;
      case 'forgotPassword':
        return <ForgotPasswordPage onShowLogin={() => setAuthScreen('login')} />;
      case 'login':
      default:
        return <LoginPage
          onShowRegister={() => setAuthScreen('register')}
          onShowForgotPassword={() => setAuthScreen('forgotPassword')}
          onLogin={refreshUserProfile}
          onBack={() => { }}
        />;
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        userProfile={userProfile}
      />
      <main className="flex-1 pb-16 md:pb-0">{renderContent()}</main>
      <Footer onSectionChange={setActiveSection} userRole={userProfile?.peran} />
      <Toaster />
    </div>
  );
}

