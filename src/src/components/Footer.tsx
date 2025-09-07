import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-3 py-2 rounded-lg">
                <span className="text-xl font-bold">SENA</span>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Platform pembelajaran digital yang menggabungkan teknologi game dengan kurikulum pendidikan 
              untuk menciptakan pengalaman belajar yang interaktif dan menyenangkan.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">Menu Utama</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Beranda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Game Edukasi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Kursus Online</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-6">Dukungan</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Panduan Pengguna</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Kontak Kami</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-teal-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    Jl. Semarang No. 5, Malang,<br />
                    Jawa Timur 65145
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <p className="text-gray-300">+62 341 551312</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <p className="text-gray-300">info@sena-learning.com</p>
              </div>
            </div>

            {/* Developer Info */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h4 className="font-medium mb-2">Pengembang SENA</h4>
              <p className="text-sm text-gray-300">
                Tim UKM Jurusan Teknologi Pendidikan<br />
                FIP UM 2025
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 SENA Learning Platform. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Developed with ❤️ by Tim Teknologi Pendidikan FIP UM
          </p>
        </div>
      </div>
    </footer>
  );
}