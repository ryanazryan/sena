import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { User as FirebaseUser } from "firebase/auth"; // Impor tipe User jika belum ada

export interface UserProfile {
  uid: string;
  namaLengkap: string;
  email: string;
  peran: 'student' | 'teacher';
  kelasIds?: string[];
  createdAt?: any;
}

// Pindahkan provider ke luar fungsi agar tidak dibuat berulang kali
const googleProvider = new GoogleAuthProvider();

export const registerUser = async (
  namaLengkap: string,
  email: string,
  pass: string,
  confirmPass: string,
  peran: 'student' | 'teacher',
  namaKelas?: string
) => {
  if (pass !== confirmPass) {
    return { user: null, error: "Password dan konfirmasi password tidak cocok." };
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;
    
    await updateProfile(user, {
        displayName: namaLengkap
    });

    const newUser: UserProfile = {
      uid: user.uid,
      namaLengkap: namaLengkap,
      email: user.email!,
      peran: peran,
      createdAt: serverTimestamp(),
    };

    if (peran === 'student' && namaKelas) {
      newUser.kelasIds = [namaKelas];
    } else if (peran === 'student') {
      newUser.kelasIds = [];
    }

    await setDoc(doc(db, "users", user.uid), newUser);
    return { user: user, error: null };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
        return { user: null, error: "Email sudah terdaftar. Silakan gunakan email lain."};
    }
    return { user: null, error: error.message };
  }
};

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

// --- FUNGSI FINAL UNTUK GOOGLE SIGN-IN (BISA LOGIN & REGISTER) ---
export const signInWithGoogle = async (role?: 'student' | 'teacher') => { // Role bersifat opsional
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    // Skenario 1: Pengguna BARU (dokumen profilnya belum ada)
    if (!docSnap.exists()) {
      // Jika ini adalah pengguna baru, 'role' WAJIB ada.
      if (!role) {
        // Mencegah pendaftaran tidak sengaja dari halaman login
        await user.delete(); // Hapus user auth jika profil gagal dibuat
        return { user: null, error: "Akun tidak ditemukan. Silakan mendaftar terlebih dahulu dari halaman registrasi." };
      }

      // Buat profil baru
      const newUserProfile: UserProfile = {
        uid: user.uid,
        namaLengkap: user.displayName || "Pengguna Google",
        email: user.email!,
        peran: role,
        createdAt: serverTimestamp(),
      };

      if (role === 'student') {
        newUserProfile.kelasIds = [];
      }
      
      await setDoc(userDocRef, newUserProfile);
    }
    
    // Skenario 2: Pengguna LAMA (dokumen sudah ada) -> Ini adalah proses LOGIN
    // Langsung kembalikan data pengguna.
    return { user: user, error: null };

  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      return { user: null, error: "Proses dibatalkan." };
    }
    return { user: null, error: "Gagal memproses permintaan Anda dengan Google." };
  }
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);
  return userDoc.exists() ? userDoc.data() as UserProfile : null;
};

// Sisa fungsi-fungsi lain yang sudah benar
export const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return { success: false, error: "Email tidak terdaftar." };
    }
    return { success: false, error: error.message };
  }
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const user = auth.currentUser;
  if (!user || !user.email) {
      return { success: false, error: "Pengguna tidak ditemukan." };
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return { success: true, error: null };
  } catch (error: any) {
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          return { success: false, error: "Password lama yang Anda masukkan salah." };
      }
      return { success: false, error: "Gagal mengubah password." };
  }
};

export const updateUserProfileData = async (uid: string, data: { namaLengkap: string }) => {
    try {
        const user = auth.currentUser;
        if (user && user.uid === uid) {
            await updateProfile(user, { displayName: data.namaLengkap });
            const userDocRef = doc(db, "users", uid);
            await updateDoc(userDocRef, { namaLengkap: data.namaLengkap });
            return { success: true, error: null };
        } else {
            throw new Error("Pengguna tidak terautentikasi.");
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const updateUserClass = async (uid: string, kelas: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, { kelasIds: [kelas] });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const deleteUserAccount = async (password: string) => {
    const user = auth.currentUser;
    if (!user || !user.email) {
        return { success: false, error: "Pengguna tidak ditemukan." };
    }
    const credential = EmailAuthProvider.credential(user.email, password);
    try {
        await reauthenticateWithCredential(user, credential);
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        return { success: true, error: null };
    } catch (error: any) {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            return { success: false, error: "Password yang Anda masukkan salah." };
        }
        return { success: false, error: "Gagal menghapus akun." };
    }
};