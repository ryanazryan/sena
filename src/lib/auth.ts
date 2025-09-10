import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
  User,
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  namaLengkap: string;
  email: string;
  peran: 'student' | 'teacher';
  // Diubah menjadi opsional agar bisa mendeteksi profil yang belum lengkap
  kelasIds?: string[];
}

export const registerUser = async (
  namaLengkap: string,
  email: string,
  pass: string,
  peran: 'student' | 'teacher',
  namaKelas?: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await sendEmailVerification(user);

    await updateProfile(user, {
        displayName: namaLengkap
    });

    const newUser: UserProfile = {
      uid: user.uid,
      namaLengkap: namaLengkap,
      email: user.email!,
      peran: peran,
    };

    if (peran === 'student' && namaKelas) {
      newUser.kelasIds = [namaKelas];
    } else if (peran === 'student') {
      newUser.kelasIds = [];
    }

    await setDoc(doc(db, "users", user.uid), newUser);

    return { user: user, error: null };

  } catch (error: any) {
    console.error("Error saat registrasi:", error.message);
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
        peran: 'student',
        kelasIds: [], 
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

export const updateUserProfileData = async (uid: string, data: { namaLengkap: string }) => {
    try {
        const user = auth.currentUser;
        if (user && user.uid === uid) {
            await updateProfile(user, {
                displayName: data.namaLengkap
            });

            const userDocRef = doc(db, "users", uid);
            await updateDoc(userDocRef, {
                namaLengkap: data.namaLengkap
            });
            
            return { success: true, error: null };
        } else {
            throw new Error("Pengguna tidak terautentikasi atau UID tidak cocok.");
        }
    } catch (error: any) {
        console.error("Gagal memperbarui profil pengguna:", error);
        return { success: false, error: error.message };
    }
};

export const updateUserClass = async (uid: string, kelas: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      kelasIds: [kelas]
    });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Gagal memperbarui kelas pengguna:", error);
    return { success: false, error: error.message };
  }
};

