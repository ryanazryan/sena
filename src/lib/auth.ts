import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  namaLengkap: string;
  email: string;
  peran: 'student' | 'teacher';
  kelasIds?: string[];
}


// === FUNGSI YANG DIMODIFIKASI ===
export const registerUser = async (
  namaLengkap: string,
  email: string,
  pass: string,
  peran: 'student' | 'teacher',
  namaKelas?: string // <-- Parameter diubah dari 'kodeKelas' menjadi 'namaKelas'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    const newUser: UserProfile = {
      uid: user.uid,
      namaLengkap: namaLengkap,
      email: user.email!,
      peran: peran,
    };

    // Logika diubah: Hanya simpan jika peran 'student' DAN namaKelas diisi
    if (peran === 'student' && namaKelas) {
      newUser.kelasIds = [namaKelas]; // <-- Menyimpan nama kelas (cth: "Kelas 7A")
    }

    await setDoc(doc(db, "users", user.uid), newUser);

    return { user: newUser, error: null };

  } catch (error: any) {
    console.error("Error saat registrasi:", error.message);
    return { user: null, error: error.message };
  }
};
// === AKHIR MODIFIKASI ===


export const loginUser = async (email: string, pass: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      return { user: null, error: "Email atau password yang Anda masukkan salah." };
    }
    return { user: null, error: error.message };
  }
};


export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      const newUserProfile: UserProfile = {
        uid: user.uid,
        namaLengkap: user.displayName || "Pengguna Google",
        email: user.email!,
        peran: 'student', // Default peran student saat login Google pertama kali
      };
      await setDoc(doc(db, "users", user.uid), newUserProfile);
    }

    return { user: user, error: null };
  } catch (error: any) {
    console.error("Error saat login dengan Google:", error.message);
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};


export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  } else {
    console.warn(`Profil pengguna dengan UID ${uid} tidak ditemukan di Firestore.`);
    return null;
  }
};