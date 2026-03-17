const { getAdmin, getDb } = require('../firebase/admin');
const { HttpError, unauthorized, forbidden } = require('../utils/httpErrors');

async function getRoleForUser(uid) {
  const db = getDb();
  const snap = await db.collection('users').doc(uid).get();
  if (!snap.exists) return undefined;
  const data = snap.data();
  return data?.role;
}

async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) throw unauthorized();

    const idToken = header.slice('Bearer '.length);
    const decoded = await getAdmin().auth().verifyIdToken(idToken);

    const role = decoded.role || (await getRoleForUser(decoded.uid));
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      role,
    };

    if (!req.user.role) throw forbidden('User has no role');
    return next();
  } catch (err) {
    if (err instanceof HttpError) return next(err);
    return next(unauthorized('Invalid or missing token'));
  }
}

function requireStaff(req, _res, next) {
  if (!req.user) return next(unauthorized());
  if (req.user.role !== 'staff') return next(forbidden());
  return next();
}

module.exports = { requireAuth, requireStaff };
