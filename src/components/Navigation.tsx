// src/components/Navigation.tsx

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  BookOpen, 
  Gamepad2, 
  GraduationCap, 
  Home, 
  User, 
  LogOut, 
  Settings,
  UserCheck,
  Users
} from "lucide-react";
import { UserProfile } from "../lib/auth";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
  userProfile: UserProfile | null;
}

export function Navigation({ activeSection, onSectionChange, onLogout, userProfile }: NavigationProps) {
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    // { id: 'library', label: 'Library Digital', icon: BookOpen },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    // { id: 'coaching', label: 'Coaching Clinic', icon: GraduationCap }
  ];

  const userRole = userProfile?.peran;
  const RoleIcon = userRole === 'teacher' ? User : UserCheck;

  const getInitials = (name: string | undefined) => {
    if (!name) return <RoleIcon className="w-4 h-4" />;
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
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
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => onSectionChange(item.id)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full hover:bg-accent cursor-pointer flex items-center justify-center outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userProfile?.namaLengkap} />
                  <AvatarFallback>
                    {getInitials(userProfile?.namaLengkap)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userProfile ? userProfile.namaLengkap : "Memuat..."}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userProfile ? userProfile.email : "..."}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                {userRole === 'teacher' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      <span>Kelola Siswa</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}