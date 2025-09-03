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
// import senaLogo from 'figma:asset/847780f818afd72c32829454920762a5430501f4.png';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
  userRole?: 'student' | 'teacher' | null;
}

export function Navigation({ activeSection, onSectionChange, onLogout, userRole }: NavigationProps) {
  const menuItems = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'library', label: 'Library Digital', icon: BookOpen },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'coaching', label: 'Coaching Clinic', icon: GraduationCap }
  ];

  const getRoleInfo = () => {
    if (userRole === 'teacher') {
      return {
        label: 'Guru',
        email: 'guru@sena.edu',
        icon: User,
        badgeColor: 'bg-green-600'
      };
    }
    return {
      label: 'Siswa',
      email: 'siswa@sena.edu',
      icon: UserCheck,
      badgeColor: 'bg-blue-600'
    };
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              // src={senaLogo} 
              alt="SENA Logo" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-xl font-semibold text-foreground">SENA</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Self-Learning Education for New Adventure</p>
            </div>
            {userRole && (
              <Badge className={`${roleInfo.badgeColor} text-white ml-2`}>
                <RoleIcon className="w-3 h-3 mr-1" />
                {roleInfo.label}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Menu */}
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

            {/* Mobile Menu */}
            <div className="md:hidden flex space-x-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                );
              })}
            </div>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-8 w-8 rounded-full hover:bg-accent cursor-pointer flex items-center justify-center outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>
                    <RoleIcon className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium leading-none">Demo {roleInfo.label}</p>
                      <Badge variant="secondary" className="text-xs">
                        {roleInfo.label}
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {roleInfo.email}
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
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard Guru</span>
                    </DropdownMenuItem>
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