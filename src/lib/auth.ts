import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, arrayUnion, updateDoc } from "firebase/firestore";

// Tipe data untuk profil pengguna
export interface UserProfile {
  uid: string;
  namaLengkap: string;
  email: string;
  peran: "student" | "teacher";
  kodeKelas?: string;
}

const userProfileCollection = "users";
const classesCollection = "classes";

// Fungsi untuk mendaftar pengguna baru dengan kode kelas
export const registerUser = async (
  namaLengkap: string,
  email: string,
  password: string,
  peran: "student" | "teacher",
  kodeKelas: string | undefined
) => {
  try {
    // Validasi kode kelas jika peran adalah siswa
    if (peran === 'student' && !kodeKelas) {
      return { error: "Kode kelas wajib diisi untuk siswa." };
    }
    
    // Periksa apakah kode kelas valid
    if (peran === 'student' && kodeKelas) {
      const classDocRef = doc(db, classesCollection, kodeKelas);
      const classDoc = await getDoc(classDocRef);
      if (!classDoc.exists()) {
        return { error: "Kode kelas tidak valid." };
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile: UserProfile = {
      uid: user.uid,
      namaLengkap,
      email,
      peran,
      kodeKelas: peran === 'student' ? kodeKelas : undefined,
    };

    // Simpan profil pengguna ke Firestore
    await setDoc(doc(db, userProfileCollection, user.uid), userProfile);

    // Tambahkan siswa ke kelas yang sesuai
    if (peran === 'student' && kodeKelas) {
      const classDocRef = doc(db, classesCollection, kodeKelas);
      await updateDoc(classDocRef, {
        studentIds: arrayUnion(user.uid),
      });
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Fungsi login
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Fungsi login dengan Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Cek apakah pengguna sudah memiliki profil di Firestore
    const userDoc = await getDoc(doc(db, userProfileCollection, user.uid));
    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        namaLengkap: user.displayName || "Pengguna Google",
        email: user.email!,
        peran: "student", 
      };
      await setDoc(doc(db, userProfileCollection, user.uid), userProfile);
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, userProfileCollection, uid);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  }
  return null;
};