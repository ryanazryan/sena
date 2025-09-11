const admin = require('firebase-admin');
const serviceAccount = require('./sena.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function cleanupOrphanedData() {
  const auth = admin.auth();
  const db = admin.firestore();

  console.log('Mengambil semua pengguna dari Firebase Authentication...');
  const listUsersResult = await auth.listUsers(1000);
const activeAuthUids = new Set(listUsersResult.users.map(user => user.uid));
  console.log(`Ditemukan ${activeAuthUids.size} pengguna aktif.`);

  console.log('Mengambil semua profil pengguna dari Firestore...');
  const profilesSnapshot = await db.collection('users').get();
  console.log(`Ditemukan ${profilesSnapshot.size} profil di Firestore.`);

  const batch = db.batch();
  let deletedCount = 0;

  profilesSnapshot.forEach(doc => {
    if (!activeAuthUids.has(doc.id)) {
      console.log(`Menjadwalkan penghapusan untuk profil yatim dengan ID: ${doc.id}`);
      batch.delete(doc.ref);
      deletedCount++;
    }
  });

  if (deletedCount > 0) {
    console.log(`Menjalankan penghapusan untuk ${deletedCount} data profil yatim...`);
    await batch.commit();
    console.log('Pembersihan selesai!');
  } else {
    console.log('Tidak ada data yatim ditemukan. Database Anda sudah bersih!');
  }
}

cleanupOrphanedData().catch(console.error);