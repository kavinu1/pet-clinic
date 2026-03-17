const dotenv = require('dotenv');

const { getAdmin, getDb } = require('../src/firebase/admin');

dotenv.config();

async function main() {
  const uid = process.argv[2];
  const role = (process.argv[3] || '').toLowerCase();

  if (!uid || !['client', 'staff'].includes(role)) {
    // eslint-disable-next-line no-console
    console.error('Usage: node scripts/setRole.js <uid> <client|staff>');
    process.exit(1);
  }

  const admin = getAdmin();
  const db = getDb();

  await admin.auth().setCustomUserClaims(uid, { role });
  await db.collection('users').doc(uid).set(
    {
      uid,
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // eslint-disable-next-line no-console
  console.log(`Updated ${uid} role => ${role}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

