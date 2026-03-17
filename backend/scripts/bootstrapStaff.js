const dotenv = require('dotenv');

const { getAdmin, getDb } = require('../src/firebase/admin');

dotenv.config();

function readArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

async function main() {
  const name = readArg('--name');
  const email = readArg('--email');
  const password = readArg('--password');

  if (!name || !email || !password) {
    // eslint-disable-next-line no-console
    console.error('Usage: node scripts/bootstrapStaff.js --name "Admin" --email admin@example.com --password "..."');
    process.exit(1);
  }

  let admin;
  let db;
  try {
    admin = getAdmin();
    db = getDb();
  } catch (err) {
    const message = err && typeof err.message === 'string' ? err.message : '';
    if (message.includes('default credentials') || message.includes('invalid-credential')) {
      // eslint-disable-next-line no-console
      console.error(
        [
          'Firebase Admin credentials are not configured, so this script cannot create a staff user.',
          '',
          'Fix (recommended for local dev):',
          '1) Download a Firebase service account key JSON for your project (Firebase Console → Project settings → Service accounts).',
          '2) Save it as backend/serviceAccountKey.json (already gitignored).',
          '3) In backend/.env, set ONE of:',
          '   - FIREBASE_SERVICE_ACCOUNT_JSON=@./serviceAccountKey.json',
          '   - FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccountKey.json',
          '   - GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json',
          '',
          'Also remove placeholder values like:',
          '   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}',
        ].join('\n')
      );
      process.exit(1);
    }
    throw err;
  }

  let userRecord;
  try {
    userRecord = await admin.auth().createUser({ displayName: name, email, password });
  } catch (err) {
    if (err && err.code === 'auth/email-already-exists') {
      userRecord = await admin.auth().getUserByEmail(email);
    } else {
      throw err;
    }
  }
  await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'staff' });

  try {
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role: 'staff',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    if (err && err.code === 5) {
      // eslint-disable-next-line no-console
      console.error(
        [
          'Firestore returned NOT_FOUND while writing the user document.',
          '',
          `Project: ${process.env.FIREBASE_PROJECT_ID || '(not set)'}`,
          '',
          'This usually means Firestore Database is not enabled/created for the project yet.',
          'Fix: Firebase Console → Build → Firestore Database → Create database (choose mode + location), then retry.',
          '',
          'Note: If the Auth user was created already, re-running is safe (this script will reuse the existing user by email).',
        ].join('\n')
      );
    }
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log(`Created staff user ${userRecord.uid} (${email})`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  if (err && err.code === 'app/invalid-credential') {
    console.error(
      [
        'Firebase Admin SDK could not authenticate (app/invalid-credential).',
        '',
        'Fix (recommended for local dev):',
        '1) Download a Firebase service account key JSON for your project (Firebase Console → Project settings → Service accounts).',
        '2) Save it as backend/serviceAccountKey.json (already gitignored).',
        '3) In backend/.env, set ONE of:',
        '   - FIREBASE_SERVICE_ACCOUNT_JSON=@./serviceAccountKey.json',
        '   - FIREBASE_SERVICE_ACCOUNT_FILE=./serviceAccountKey.json',
        '   - GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/serviceAccountKey.json',
        '',
        'Also remove placeholder values like:',
        '   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}',
      ].join('\n')
    );
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});
