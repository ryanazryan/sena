import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { 
  BookOpen, 
  Gamepad2, 
  GraduationCap, 
  Mail, 
  MessageCircle,
  Instagram,
  Phone,
  MapPin,
  Heart,
  ExternalLink,
  Home
} from "lucide-react";
// import senaLogo from 'figma:asset/847780f818afd72c32829454920762a5430501f4.png';

interface FooterProps {
  onSectionChange?: (section: string) => void;
  userRole?: 'student' | 'teacher' | null;
}

export function Footer({ onSectionChange, userRole }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { id: 'home', label: 'Dashboard', icon: Home },
    // { id: 'library', label: 'Library Digital', icon: BookOpen },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    // { id: 'coaching', label: 'Coaching Clinic', icon: GraduationCap }
  ];

  const contactInfo = [
    {
      type: 'email',
      label: 'Email Admin',
      value: 'admin@sena.edu',
      href: 'mailto:admin@sena.edu',
      icon: Mail,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      type: 'whatsapp',
      label: 'WhatsApp',
      value: '+62 812-3456-7890',
      href: 'https://wa.me/6281234567890',
      icon: MessageCircle,
      color: 'text-green-600 hover:text-green-700'
    },
    {
      type: 'instagram',
      label: 'Instagram',
      value: '@sena.education',
      href: 'https://instagram.com/sena.education',
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700'
    }
  ];

  const quickInfo = [
    {
      label: 'Tentang SENA',
      description: 'Platform pembelajaran mandiri untuk petualangan pendidikan baru'
    },
    {
      label: 'Visi Kami',
      description: 'Menjadi platform edukasi terdepan dengan teknologi AI'
    },
    {
      label: 'Misi Kami',
      description: 'Memberikan akses pendidikan berkualitas untuk semua'
    }
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand & Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  // src={senaLogo} 
                  alt="SENA Logo" 
                  className="w-10 h-10"
                />
                <div>
                  <h3 className="font-semibold text-foreground">SENA</h3>
                  <p className="text-xs text-muted-foreground">Self-Learning Education</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Platform pembelajaran mandiri yang menghadirkan petualangan baru dalam dunia pendidikan 
                dengan teknologi AI, library digital terlengkap, dan sistem evaluasi terintegrasi.
              </p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-foreground mb-4">Navigasi Cepat</h4>
              <ul className="space-y-3">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.id}>
                      <button
                        onClick={() => onSectionChange?.(link.id)}
                        className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group"
                      >
                        <Icon className="w-4 h-4 mr-2 group-hover:text-primary" />
                        {link.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
              
              {userRole && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Mode Aktif:</p>
                  <div className="flex items-center text-sm">
                    <div className={`w-2 h-2 rounded-full mr-2 ${userRole === 'teacher' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="font-medium">{userRole === 'teacher' ? 'Guru' : 'Siswa'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-foreground mb-4">Hubungi Admin</h4>
              <ul className="space-y-3">
                {contactInfo.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <li key={contact.type}>
                      <a
                        href={contact.href}
                        target={contact.type !== 'email' ? '_blank' : undefined}
                        rel={contact.type !== 'email' ? 'noopener noreferrer' : undefined}
                        className={`flex items-center text-sm ${contact.color} transition-colors group`}
                      >
                        <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                        <div>
                          <div className="font-medium">{contact.label}</div>
                          <div className="text-xs opacity-80">{contact.value}</div>
                        </div>
                        {contact.type !== 'email' && (
                          <ExternalLink className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
              
              {/* Quick Contact Buttons */}
              <div className="mt-4 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-xs"
                  onClick={() => window.open('mailto:admin@sena.edu')}
                >
                  <Mail className="w-3 h-3 mr-2" />
                  Kirim Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-xs"
                  onClick={() => window.open('https://wa.me/6281234567890')}
                >
                  <MessageCircle className="w-3 h-3 mr-2" />
                  Chat WhatsApp
                </Button>
              </div>
            </div>

            {/* Platform Info */}
            <div className="lg:col-span-1">
              <h4 className="font-medium text-foreground mb-4">Tentang Platform</h4>
              <ul className="space-y-4">
                {quickInfo.map((info, index) => (
                  <li key={index} className="text-sm">
                    <div className="font-medium text-foreground mb-1">{info.label}</div>
                    <div className="text-muted-foreground text-xs leading-relaxed">
                      {info.description}
                    </div>
                  </li>
                ))}
              </ul>
              
              {/* Platform Stats */}
              <div className="mt-6 p-3 bg-muted rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Platform Stats</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-medium text-foreground">10,000+</div>
                    <div className="text-muted-foreground">Pengguna</div>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">5,000+</div>
                    <div className="text-muted-foreground">Buku Digital</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Footer Bottom */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <span>© {currentYear} SENA Platform.</span>
                <span className="mx-2">Dibuat dengan</span>
                <Heart className="w-3 h-3 text-red-500 mx-1" />
                <span>untuk pendidikan Indonesia</span>
              </div>
            </div>

            {/* Footer Links */}
            <div className="flex items-center space-x-6 text-xs text-muted-foreground">
              <button className="hover:text-primary transition-colors">
                Kebijakan Privasi
              </button>
              <button className="hover:text-primary transition-colors">
                Syarat & Ketentuan
              </button>
              <button className="hover:text-primary transition-colors">
                Bantuan
              </button>
              <div className="flex items-center space-x-2">
                <span>Versi 1.0.0</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Platform Online"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Contact Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 z-40">
          <div className="flex justify-center space-x-4">
            {contactInfo.map((contact) => {
              const Icon = contact.icon;
              return (
                <a
                  key={contact.type}
                  href={contact.href}
                  target={contact.type !== 'email' ? '_blank' : undefined}
                  rel={contact.type !== 'email' ? 'noopener noreferrer' : undefined}
                  className={`flex flex-col items-center p-2 rounded-lg ${contact.color} transition-colors`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{contact.type === 'email' ? 'Email' : contact.type === 'whatsapp' ? 'WA' : 'IG'}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}