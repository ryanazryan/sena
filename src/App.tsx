import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { getUserProfile, UserProfile, logoutUser } from "./lib/auth";

import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { DigitalLibrary } from "./components/DigitalLibrary";
import { GamesSection } from "./components/GamesSection";
import { CoachingSection } from "./components/CoachingSection";
import { Footer } from "./components/Footer";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleLogout = async () => {
    await logoutUser();
    setActiveSection("home");
  };

  const renderContent = () => {
    const userRole = userProfile?.peran;
    switch (activeSection) {
      case "home":
        return <HomePage onSectionChange={setActiveSection} userRole={userRole} />;
      case "library":
        return <DigitalLibrary userRole={userRole} />;
      case "games":
        return <GamesSection userRole={userRole} />;
      case "coaching":
        return <CoachingSection userRole={userRole} />;
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
      <LoginPage onShowRegister={() => setShowLogin(false)} />
    ) : (
      <RegisterPage onShowLogin={() => setShowLogin(true)} />
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
    </div>
  );
}