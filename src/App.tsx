import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { getUserProfile, UserProfile, logoutUser } from "./lib/auth";

import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { VerifyEmailPage } from "./components/VerifyEmailPage";
import { Navigation } from "./components/Navigation";
import { DigitalLibrary } from "./components/DigitalLibrary";
import { GamesSection } from "./components/GamesSection";
import { CoachingSection } from "./components/CoachingSection";
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
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [userForVerification, setUserForVerification] = useState<User | null>(null);
  
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
        if (currentUser.emailVerified) {
          const firestoreProfile = await getUserProfile(currentUser.uid);
          setUserProfile(firestoreProfile);
        } else {
          setUserProfile(null);
        }
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
    setShowLogin(true);
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

      case "library":
        return <DigitalLibrary userRole={userRole} />;
      case "games":
        return <GamesSection userRole={userRole} user={user} />;
      case "coaching":
        return <CoachingSection userRole={userRole} />;
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

  if (showVerifyEmail && userForVerification) {
      return (
          <VerifyEmailPage 
              user={userForVerification} 
              onBackToLogin={() => {
                  setShowVerifyEmail(false);
                  setUserForVerification(null);
                  setShowLogin(true);
              }} 
          />
      );
  }

  if (user && !user.emailVerified) {
    return (
      <VerifyEmailPage 
        user={user} 
        onBackToLogin={async () => {
          await handleLogout();
        }} 
      />
    );
  }
  
  if (!user) {
    return showLogin ? (
      <LoginPage
        onShowRegister={() => setShowLogin(false)}
        onLogin={refreshUserProfile}
        onBack={() => {}}
      />
    ) : (
      <RegisterPage
        onShowLogin={() => setShowLogin(true)}
        onRegisterSuccess={(newUser) => {
          setUserForVerification(newUser);
          setShowVerifyEmail(true);
          setShowLogin(false);
        }}
        onBack={() => {
          setShowLogin(true);
        }}
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

