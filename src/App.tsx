import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Navigation } from "./components/Navigation";
import { HomePage } from "./components/HomePage";
import { DigitalLibrary } from "./components/DigitalLibrary";
import { GamesSection } from "./components/GamesSection";
import { CoachingSection } from "./components/CoachingSection";
import { Footer } from "./components/Footer";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "teacher" | null>(null);
  const [activeSection, setActiveSection] = useState("home");

  const handleLogin = (role: "student" | "teacher") => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActiveSection("home");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <HomePage onSectionChange={setActiveSection} userRole={userRole} />
        );
      case "library":
        return <DigitalLibrary userRole={userRole} />;
      case "games":
        return <GamesSection userRole={userRole} />;
      case "coaching":
        return <CoachingSection userRole={userRole} />;
      default:
        return (
          <HomePage onSectionChange={setActiveSection} userRole={userRole} />
        );
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        userRole={userRole}
      />
      <main className="flex-1 pb-16 md:pb-0">{renderContent()}</main>
      <Footer onSectionChange={setActiveSection} userRole={userRole} />
    </div>
  );
}
