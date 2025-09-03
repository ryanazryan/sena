import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Book, Star, Clock, Download } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DigitalLibraryProps {
  userRole?: 'student' | 'teacher' | null;
}

export function DigitalLibrary({ userRole }: DigitalLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: 'all', name: 'Semua', count: 150 },
    { id: 'fiction', name: 'Fiksi', count: 45 },
    { id: 'non-fiction', name: 'Non-Fiksi', count: 38 },
    { id: 'children', name: 'Anak-anak', count: 32 },
    { id: 'educational', name: 'Edukasi', count: 35 }
  ];

  const books = [
    {
      id: 1,
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      category: "fiction",
      rating: 4.8,
      readTime: "6 jam",
      description: "Novel tentang perjalanan hidup anak-anak Belitung yang penuh inspirasi",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      popular: true
    },
    {
      id: 2,
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      category: "fiction",
      rating: 4.9,
      readTime: "8 jam",
      description: "Karya sastra Indonesia yang mengisahkan perjalanan Minke",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      popular: true
    },
    {
      id: 3,
      title: "Sejarah Indonesia Modern",
      author: "M.C. Ricklefs",
      category: "non-fiction",
      rating: 4.6,
      readTime: "12 jam",
      description: "Komprehensif tentang sejarah Indonesia dari masa kolonial hingga modern",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      popular: false
    },
    {
      id: 4,
      title: "Dongeng Nusantara",
      author: "Tim Penulis",
      category: "children",
      rating: 4.7,
      readTime: "2 jam",
      description: "Kumpulan dongeng tradisional Indonesia untuk anak-anak",
      cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      popular: false
    },
    {
      id: 5,
      title: "Panduan Menulis Kreatif",
      author: "Dr. Sarah Wijaya",
      category: "educational",
      rating: 4.5,
      readTime: "4 jam",
      description: "Tips dan teknik menulis kreatif untuk pemula hingga mahir",
      cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      popular: false
    },
    {
      id: 6,
      title: "Membaca Cepat dan Efektif",
      author: "Prof. Ahmad Kusuma",
      category: "educational",
      rating: 4.4,
      readTime: "3 jam",
      description: "Metode membaca cepat yang terbukti meningkatkan pemahaman",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      popular: true
    }
  ];

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const BookCard = ({ book }: { book: typeof books[0] }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="aspect-[3/4] overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
            <CardDescription className="text-sm">{book.author}</CardDescription>
          </div>
          {book.popular && (
            <Badge variant="secondary" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Populer
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {book.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {book.rating}
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {book.readTime}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <Book className="w-3 h-3 mr-1" />
            {userRole === 'teacher' ? 'Rekomendasikan' : 'Baca'}
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Library Digital</h1>
        <p className="text-muted-foreground">
          {userRole === 'teacher' 
            ? 'Kelola koleksi buku digital dan berikan rekomendasi untuk siswa'
            : 'Jelajahi koleksi buku digital kami yang lengkap dan berkualitas'
          }
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Cari buku atau penulis..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
              {category.name}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredBooks
                .filter(book => category.id === 'all' || book.category === category.id)
                .map(book => (
                  <BookCard key={book.id} book={book} />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Tidak ada buku ditemukan</h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian Anda
          </p>
        </div>
      )}
    </div>
  );
}