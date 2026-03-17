const express = require('express');

const { requireAuth, requireStaff } = require('../middleware/auth');
const { getDb } = require('../firebase/admin');

const router = express.Router();

/**
 * GET /users
 * Staff-only list of clients, used when assigning owners to pets.
 */
router.get('/users', requireAuth, requireStaff, async (_req, res, next) => {
  try {
    const snap = await getDb().collection('users').where('role', '==', 'client').get();
    const users = snap.docs.map((d) => {
      const data = d.data();
      return { uid: data.uid, name: data.name, email: data.email, role: data.role };
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

