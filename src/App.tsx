import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { auth, db } from "./lib/firebase";
import { getUserProfile, UserProfile, logoutUser } from "./lib/auth";

import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { DigitalLibrary } from "./components/DigitalLibrary";
import { GamesSection } from "./components/GamesSection";
import { CoachingSection } from "./components/CoachingSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { StudentDashboard } from "./components/StudentDashboard";
import { AboutSection } from "./components/AboutSection";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { Loader2 } from "lucide-react";

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

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'games' | 'guide' | 'input-scores' | 'manage-class' | 'manage-games' | 'about';
type UserType = 'student' | 'teacher' | null;

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [studentSubmissions, setStudentSubmissions] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const firestoreProfile = await getUserProfile(currentUser.uid);
        if (firestoreProfile) {
          setUserProfile(firestoreProfile);
        } else {
          console.warn("Profil Firestore tidak ditemukan, membuat profil sementara dari data Auth.");
          setUserProfile({
            uid: currentUser.uid,
            namaLengkap: currentUser.displayName || "Pengguna Baru",
            email: currentUser.email!,
            peran: 'student', 
          });
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!user || userProfile?.peran !== 'student') return;

    const submissionsCol = collection(db, "gameSubmissions");
    const q = query(
      submissionsCol,
      where("userId", "==", user.uid),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data: ScoreEntry[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ScoreEntry);
      });
      setStudentSubmissions(data);
    }, (error) => {
      console.error("Error fetching student submissions: ", error);
    });

    return () => unsubscribe();
  }, [user, userProfile]);

  const handleLogout = async () => {
    await logoutUser();
    setActiveSection("home");
  };
  
  const handleAuthSuccess = () => {
    setActiveSection("home");
  };

  const renderContent = () => {
    const userRole = userProfile?.peran;
    
    // Perbaikan: Tambahkan guard clause untuk userProfile
    if (user && !userProfile) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!user) {
      return <HomePage onSectionChange={setActiveSection} userRole={userRole} />;
    }

    if (userRole === 'teacher' && activeSection === 'home') {
        return <TeacherDashboard user={user} userProfile={userProfile!} onSectionChange={setActiveSection} />;
    }

    if (userRole === 'student' && activeSection === 'home') {
      return <StudentDashboard onSectionChange={setActiveSection} userRole={userRole} submissions={studentSubmissions} />;
    }

    switch (activeSection) {
      case "home":
        return <HomePage onSectionChange={setActiveSection} userRole={userRole} />;
      case "library":
        return <DigitalLibrary userRole={userRole} />;
      case "games":
        return <GamesSection userRole={userRole} user={user} userProfile={userProfile!} />;
      case "coaching":
        return <CoachingSection userRole={userRole} />;
      case "about":
        return <AboutSection />;
      default:
        return <HomePage onSectionChange={setActiveSection} userRole={userRole} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <LoginPage
        onBack={() => {}}
        onLogin={handleAuthSuccess}
        onShowRegister={() => setShowLogin(false)}
      />
    ) : (
      <RegisterPage
        onBack={() => {}}
        onRegister={handleAuthSuccess}
        onShowLogin={() => setShowLogin(true)}
      />
    );
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