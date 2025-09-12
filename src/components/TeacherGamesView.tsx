import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Plus, Loader2, Check, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

type ManagedGame = {
  id: string;
  name: string;
  link: string;
  deadline: Timestamp;
  level: number; 
};

export const TeacherGamesView = () => {
  const [games, setGames] = useState<ManagedGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [gameName, setGameName] = useState("");
  const [gameLink, setGameLink] = useState("");
  const [deadline, setDeadline] = useState("");
  const [level, setLevel] = useState("1"); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editingGame, setEditingGame] = useState<ManagedGame | null>(null);
  const [gameToDelete, setGameToDelete] = useState<ManagedGame | null>(null);
  const [editName, setEditName] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editLevel, setEditLevel] = useState("1");

  useEffect(() => {
    const gamesCollection = collection(db, "managedGames");
    const q = query(gamesCollection, orderBy("level", "asc")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gamesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ManagedGame));
      setGames(gamesData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingGame) {
      setEditName(editingGame.name);
      setEditLink(editingGame.link);
      setEditDeadline(editingGame.deadline.toDate().toISOString().split('T')[0]);
      setEditLevel(String(editingGame.level)); // Diubah dari stage
    }
  }, [editingGame]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName || !gameLink || !deadline || !level) {
      setError("Semua field wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await addDoc(collection(db, "managedGames"), {
        name: gameName,
        link: gameLink,
        deadline: Timestamp.fromDate(new Date(deadline)),
        level: parseInt(level, 10),
        createdAt: Timestamp.now()
      });
      setSuccess("Game baru berhasil ditambahkan!");
      setGameName("");
      setGameLink("");
      setDeadline("");
      setLevel("1");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal menambahkan game.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    setIsSubmitting(true);
    try {
      const gameRef = doc(db, "managedGames", editingGame.id);
      await updateDoc(gameRef, {
        name: editName,
        link: editLink,
        deadline: Timestamp.fromDate(new Date(editDeadline)),
        level: parseInt(editLevel, 10),
      });
      setEditingGame(null);
    } catch (err) {
      console.error("Gagal memperbarui game:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!gameToDelete) return;
    try {
      await deleteDoc(doc(db, "managedGames", gameToDelete.id));
      setGameToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus game:", err);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Plus className="w-5 h-5 mr-2" /> Tambah Game Baru</CardTitle>
          <CardDescription>Tambahkan link game, atur deadline, dan pilih level untuk siswa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gameName">Nama Game</Label>
              <Input id="gameName" value={gameName} onChange={e => setGameName(e.target.value)} placeholder="Contoh: Petualangan Kosa Kata" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gameLink">Link Game</Label>
              <Input id="gameLink" type="url" value={gameLink} onChange={e => setGameLink(e.target.value)} placeholder="https://contohgame.com/main" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Pilih Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level" className="w-full">
                    <SelectValue placeholder="Pilih Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
              {isSubmitting ? "Menyimpan..." : "Simpan Game"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Daftar Game yang Dikelola</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
            : games.length > 0 ? (
              <div className="space-y-2">
                {games.map(game => (
                  <div key={game.id} className="flex items-center justify-between p-3 border rounded-lg gap-2 flex-wrap">
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      <Badge variant="secondary">Level {game.level}</Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{game.name}</p>
                        <a href={game.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 truncate">
                          <ExternalLink className="w-3 h-3" /> {game.link}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0 gap-2">
                      <Badge variant="outline">Deadline: {game.deadline.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</Badge>
                      <Button variant="outline" size="icon" onClick={() => setEditingGame(game)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="icon" onClick={() => setGameToDelete(game)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground text-center">Belum ada game yang ditambahkan.</p>}
        </CardContent>
      </Card>

      <Dialog open={!!editingGame} onOpenChange={(open) => !open && setEditingGame(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Detail Game</DialogTitle>
            <DialogDescription>Perbarui nama, link, deadline, atau level untuk game ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editGameName">Nama Game</Label>
              <Input id="editGameName" value={editName} onChange={e => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editGameLink">Link Game</Label>
              <Input id="editGameLink" type="url" value={editLink} onChange={e => setEditLink(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDeadline">Deadline</Label>
                <Input id="editDeadline" type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLevel">Pilih Level</Label>
                <Select value={editLevel} onValueChange={setEditLevel}>
                  <SelectTrigger id="editLevel" className="w-full">
                    <SelectValue placeholder="Pilih Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Batal</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!gameToDelete} onOpenChange={(open) => !open && setGameToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus game "{gameToDelete?.name}" secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};