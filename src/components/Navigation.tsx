import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, User, UserCheck, Home, Gamepad2, BookOpen, Menu } from "lucide-react";
import { UserProfile } from "../lib/auth";
import { Badge } from "./ui/badge";
import logo from "../assets/logo.png";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userProfile: UserProfile | null;
}

export function Navigation({ activeSection, onSectionChange, onLogout, userProfile }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Dasbor', icon: Home },
    { id: 'games', label: 'Permainan', icon: Gamepad2 },
    { id: 'aboutus', label: 'Tentang Kami', icon: BookOpen },
  ];

  const userRole = userProfile?.peran;
  const RoleIcon = userRole === 'teacher' ? User : UserCheck;

  const getInitials = (name: string | undefined) => {
    if (!name) return <RoleIcon className="w-4 h-4" />;
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SENA Logo" className="w-16 h-16" />
            <div>
              <h1 className="text-xl font-semibold text-foreground">SENA</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Self-Learning Education for New Adventure</p>
            </div>
            {userRole && (
              <Badge className={`${userRole === 'teacher' ? 'bg-green-600' : 'bg-blue-600'} text-white ml-2`}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {userRole === 'teacher' ? 'Guru' : 'Siswa'}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden md:flex space-x-1">
              {menuItems.map((item) => (
                <Button key={item.id} variant={activeSection === item.id ? "default" : "ghost"} onClick={() => onSectionChange(item.id)} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9"><AvatarImage src="" alt={userProfile?.namaLengkap} /><AvatarFallback>{getInitials(userProfile?.namaLengkap)}</AvatarFallback></Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1"><p className="text-sm font-medium leading-none">{userProfile ? userProfile.namaLengkap : "Memuat..."}</p><p className="text-xs leading-none text-muted-foreground">{userProfile ? userProfile.email : "..."}</p></div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onSectionChange('profile')} className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>Profil</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer"><LogOut className="mr-2 h-4 w-4" /><span>Keluar</span></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Buka menu</span>
                  </Button>
                </SheetTrigger>
                {/* --- Perubahan di sini --- */}
                <SheetContent side="left" className="flex flex-col w-4/5 p-0 sm:max-w-xs">
                  <div className="flex items-center space-x-3 p-4 border-b">
                    <img src={logo} alt="SENA Logo" className="w-12 h-12" />
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">SENA App</h2>
                      <p className="text-xs text-muted-foreground">Navigasi Utama</p>
                    </div>
                  </div>

                  <div className="flex-grow p-4">
                    <div className="flex flex-col space-y-2">
                      {menuItems.map((item) => (
                        <SheetClose asChild key={item.id}>
                          <Button
                            variant={activeSection === item.id ? "secondary" : "ghost"}
                            onClick={() => handleSectionChange(item.id)}
                            className="w-full justify-start text-md py-6 rounded-lg transition-all duration-200"
                          >
                            <item.icon className="mr-4 h-5 w-5 text-primary" />
                            {item.label}
                          </Button>
                        </SheetClose>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t text-center">
                    <p className="text-xs text-muted-foreground">
                      &copy; {new Date().getFullYear()} SENA | Belajar Jadi Seru
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}