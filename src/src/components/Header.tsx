import { Button } from "./ui/button";
import { Menu, Search, User } from "lucide-react";

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-2 rounded-lg">
              <span className="text-xl font-bold">SENA</span>
            </div>
            <div className="hidden md:block">
              <span className="text-sm text-gray-600">Learning Games Platform</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
              Beranda
            </a>
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
              Games
            </a>
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
              Kursus
            </a>
            <a href="#" className="text-gray-700 hover:text-teal-600 transition-colors">
              Tentang
            </a>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={onLoginClick}>
              Masuk
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600" onClick={onRegisterClick}>
              Daftar
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}