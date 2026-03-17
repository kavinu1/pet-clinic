const express = require('express');

const { getAdmin, getDb } = require('../firebase/admin');
const { requireAuth, requireStaff } = require('../middleware/auth');
const { signInWithEmailPassword } = require('../services/firebaseRestAuth');
const { badRequest, forbidden } = require('../utils/httpErrors');
const { assertNonEmptyString, assertStringEnum } = require('../utils/validators');

const router = express.Router();

/**
 * POST /register
 * Clients can self-register.
 * Staff accounts require an authenticated staff user (or manual creation in Firebase Console).
 */
router.post('/register', async (req, res, next) => {
  try {
    const name = assertNonEmptyString(req.body?.name, 'name');
    const email = assertNonEmptyString(req.body?.email, 'email');
    const password = assertNonEmptyString(req.body?.password, 'password');
    const role = assertStringEnum(req.body?.role || 'client', 'role', ['client', 'staff']);

    // Only staff can create staff users via this route.
    if (role === 'staff') {
      const header = req.headers.authorization;
      if (!header) throw forbidden('Staff registration requires admin');
      await new Promise((resolve, reject) =>
        requireAuth(req, res, (err) => (err ? reject(err) : resolve()))
      );
      await new Promise((resolve, reject) =>
        requireStaff(req, res, (err) => (err ? reject(err) : resolve()))
      );
    }

    const admin = getAdmin();
    const db = getDb();

    const userRecord = await admin.auth().createUser({
      displayName: name,
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      name,
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ uid: userRecord.uid, email, name, role });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /login
 * Uses Firebase Auth REST API to exchange email/password for an ID token.
 */
router.post('/login', async (req, res, next) => {
  try {
    const email = assertNonEmptyString(req.body?.email, 'email');
    const password = assertNonEmptyString(req.body?.password, 'password');

    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    const tokenResponse = await signInWithEmailPassword({ email, password, apiKey });

    const decoded = await getAdmin().auth().verifyIdToken(tokenResponse.idToken);
    const userSnap = await getDb().collection('users').doc(decoded.uid).get();
    if (!userSnap.exists) throw badRequest('User profile missing (users collection)');

    const user = userSnap.data();

    res.json({
      idToken: tokenResponse.idToken,
      refreshToken: tokenResponse.refreshToken,
      expiresIn: tokenResponse.expiresIn,
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: user?.name,
        role: user?.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

