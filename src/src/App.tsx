import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { GamesSection } from "./components/GamesSection";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { DashboardPage } from "./components/DashboardPage";
import { GamesPage } from "./components/GamesPage";
import { GuidePage } from "./components/GuidePage";
import { InputScoresPage } from "./components/InputScoresPage";
import { ManageClassPage } from "./components/ManageClassPage";
import { ManageGamesPage } from "./components/ManageGamesPage";

type Page = 'home' | 'login' | 'register' | 'dashboard' | 'games' | 'guide' | 'input-scores' | 'manage-class' | 'manage-games';
type UserType = 'student' | 'teacher' | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<{ type: UserType; email: string; name?: string } | null>(null);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'register') {
        setCurrentPage('register');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginClick = () => {
    setCurrentPage('login');
    window.location.hash = '#login';
  };

  const handleRegisterClick = () => {
    setCurrentPage('register');
    window.location.hash = '#register';
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.location.hash = '';
  };

  // Mock user accounts for demo
  const demoAccounts = {
    student: [
      { email: 'andi.siswa@gmail.com', password: 'siswa123', name: 'Andi Pratama', grade: '5', school: 'SDN 1 Malang' },
      { email: 'sari.siswa@gmail.com', password: 'siswa123', name: 'Sari Dewi', grade: '4', school: 'SDN 2 Malang' },
      { email: 'budi.siswa@gmail.com', password: 'siswa123', name: 'Budi Santoso', grade: '6', school: 'SDN 3 Malang' }
    ],
    teacher: [
      { email: 'pak.ahmad@sdn1malang.sch.id', password: 'guru123', name: 'Ahmad Wijaya, S.Pd', subject: 'Matematika', nip: '196803141989031007' },
      { email: 'bu.siti@sdn2malang.sch.id', password: 'guru123', name: 'Siti Nurhaliza, S.Pd', subject: 'Bahasa Indonesia', nip: '197205091998032005' },
      { email: 'pak.rizki@sdn3malang.sch.id', password: 'guru123', name: 'Rizki Rahman, S.Pd', subject: 'IPA', nip: '198109152005011003' }
    ]
  };

  const handleLogin = (userType: 'student' | 'teacher', email: string, password: string) => {
    // Find user in demo accounts
    const accounts = demoAccounts[userType];
    const foundUser = accounts.find(account => account.email === email && account.password === password);
    
    if (foundUser) {
      setUser({ type: userType, email, name: foundUser.name });
      alert(`Login berhasil! Selamat datang ${userType === 'student' ? 'Siswa' : 'Guru'} ${foundUser.name}`);
      setCurrentPage('dashboard');
      window.location.hash = '';
      return true;
    } else {
      alert('Email atau password salah! Silakan gunakan akun demo yang tersedia.');
      return false;
    }
  };

  const handleRegister = (userType: 'student' | 'teacher', email: string) => {
    setUser({ type: userType, email });
    // In real app, you would handle registration here
    alert(`Registrasi berhasil! Akun ${userType === 'student' ? 'siswa' : 'guru'} untuk ${email} telah dibuat.`);
    setCurrentPage('dashboard');
    window.location.hash = '';
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
    window.location.hash = '';
  };

  const handleNavigateToGames = () => {
    setCurrentPage('games');
  };

  const handleNavigateToGuide = () => {
    setCurrentPage('guide');
  };

  const handleNavigateToInputScores = () => {
    setCurrentPage('input-scores');
  };

  const handleNavigateToManageClass = () => {
    setCurrentPage('manage-class');
  };

  const handleNavigateToManageGames = () => {
    setCurrentPage('manage-games');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (currentPage === 'login') {
    return <LoginPage onBack={handleBackToHome} onLogin={handleLogin} />;
  }

  if (currentPage === 'register') {
    return <RegisterPage onBack={handleBackToHome} onRegister={handleRegister} />;
  }

  // Handle authenticated user pages
  if (user) {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage 
            user={user} 
            onLogout={handleLogout}
            onNavigateToGames={handleNavigateToGames}
            onNavigateToGuide={handleNavigateToGuide}
            onNavigateToInputScores={handleNavigateToInputScores}
            onNavigateToManageClass={handleNavigateToManageClass}
            onNavigateToManageGames={handleNavigateToManageGames}
          />
        );
      case 'games':
        return <GamesPage user={user} onBack={handleBackToDashboard} />;
      case 'guide':
        return <GuidePage user={user} onBack={handleBackToDashboard} />;
      case 'input-scores':
        return <InputScoresPage user={user} onBack={handleBackToDashboard} />;
      case 'manage-class':
        return <ManageClassPage user={user} onBack={handleBackToDashboard} />;
      case 'manage-games':
        return <ManageGamesPage user={user} onBack={handleBackToDashboard} />;
      default:
        return (
          <DashboardPage 
            user={user} 
            onLogout={handleLogout}
            onNavigateToGames={handleNavigateToGames}
            onNavigateToGuide={handleNavigateToGuide}
            onNavigateToInputScores={handleNavigateToInputScores}
            onNavigateToManageClass={handleNavigateToManageClass}
            onNavigateToManageGames={handleNavigateToManageGames}
          />
        );
    }
  }

  // Show homepage if not logged in
  return (
    <div className="min-h-screen">
      <Header onLoginClick={handleLoginClick} onRegisterClick={handleRegisterClick} />
      <main>
        <HeroSection />
        <FeaturesSection />
        <GamesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}