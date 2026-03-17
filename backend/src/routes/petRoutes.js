const express = require('express');

const { getAdmin, getDb } = require('../firebase/admin');
const { requireAuth, requireStaff } = require('../middleware/auth');
const { badRequest, notFound, forbidden } = require('../utils/httpErrors');
const {
  assertArray,
  assertNonEmptyString,
  assertOptionalNumber,
  assertOptionalString,
} = require('../utils/validators');

const router = express.Router();

async function requireClientOwner(ownerId) {
  const userSnap = await getDb().collection('users').doc(ownerId).get();
  if (!userSnap.exists) throw badRequest('Owner not found');
  const owner = userSnap.data();
  if (owner?.role !== 'client') throw badRequest('Owner must be a client');
  return owner;
}

function normalizeLower(value) {
  return String(value || '').trim().toLowerCase();
}

router.post('/pets', requireAuth, requireStaff, async (req, res, next) => {
  try {
    const name = assertNonEmptyString(req.body?.name, 'name');
    const species = assertNonEmptyString(req.body?.species, 'species');
    const breed = assertOptionalString(req.body?.breed, 'breed');
    const age = assertOptionalNumber(req.body?.age, 'age');
    const ownerId = assertNonEmptyString(req.body?.ownerId, 'ownerId');
    const vaccinationRecords = assertArray(req.body?.vaccinationRecords, 'vaccinationRecords');
    const medicalNotes = assertOptionalString(req.body?.medicalNotes, 'medicalNotes') || '';

    const owner = await requireClientOwner(ownerId);

    const admin = getAdmin();
    const db = getDb();
    const ref = db.collection('pets').doc();
    const petId = ref.id;

    const now = admin.firestore.FieldValue.serverTimestamp();

    const petDoc = {
      petId,
      name,
      nameLower: normalizeLower(name),
      species,
      breed: breed || '',
      age: age ?? null,
      ownerId,
      ownerName: owner?.name || '',
      ownerNameLower: normalizeLower(owner?.name || ''),
      vaccinationRecords,
      medicalNotes,
      createdAt: now,
      updatedAt: now,
    };

    await ref.set(petDoc);

    res.status(201).json({ pet: petDoc });
  } catch (err) {
    next(err);
  }
});

router.get('/pets', requireAuth, async (req, res, next) => {
  try {
    const db = getDb();
    const role = req.user.role;

    if (role === 'client') {
      const snap = await db.collection('pets').where('ownerId', '==', req.user.uid).get();
      return res.json({ pets: snap.docs.map((d) => d.data()) });
    }

    // Staff listing + search
    const name = typeof req.query.name === 'string' ? req.query.name : '';
    const ownerName = typeof req.query.ownerName === 'string' ? req.query.ownerName : '';
    const ownerId = typeof req.query.ownerId === 'string' ? req.query.ownerId : '';

    let query = db.collection('pets');

    if (ownerId) {
      query = query.where('ownerId', '==', ownerId);
      const snap = await query.get();
      return res.json({ pets: snap.docs.map((d) => d.data()) });
    }

    if (name) {
      const prefix = normalizeLower(name);
      const snap = await query
        .orderBy('nameLower')
        .startAt(prefix)
        .endAt(`${prefix}\uf8ff`)
        .get();
      return res.json({ pets: snap.docs.map((d) => d.data()) });
    }

    if (ownerName) {
      const prefix = normalizeLower(ownerName);
      const snap = await query
        .orderBy('ownerNameLower')
        .startAt(prefix)
        .endAt(`${prefix}\uf8ff`)
        .get();
      return res.json({ pets: snap.docs.map((d) => d.data()) });
    }

    const snap = await query.orderBy('updatedAt', 'desc').limit(200).get();
    return res.json({ pets: snap.docs.map((d) => d.data()) });
  } catch (err) {
    next(err);
  }
});

router.get('/pets/:id', requireAuth, async (req, res, next) => {
  try {
    const id = assertNonEmptyString(req.params?.id, 'id');
    const snap = await getDb().collection('pets').doc(id).get();
    if (!snap.exists) throw notFound('Pet not found');
    const pet = snap.data();

    if (req.user.role === 'client' && pet.ownerId !== req.user.uid) throw forbidden();

    res.json({ pet });
  } catch (err) {
    next(err);
  }
});

router.put('/pets/:id', requireAuth, requireStaff, async (req, res, next) => {
  try {
    const id = assertNonEmptyString(req.params?.id, 'id');
    const ref = getDb().collection('pets').doc(id);
    const snap = await ref.get();
    if (!snap.exists) throw notFound('Pet not found');

    const updates = {};
    if (req.body?.name != null) {
      const name = assertNonEmptyString(req.body?.name, 'name');
      updates.name = name;
      updates.nameLower = normalizeLower(name);
    }
    if (req.body?.species != null) updates.species = assertNonEmptyString(req.body?.species, 'species');
    if (req.body?.breed != null) updates.breed = assertOptionalString(req.body?.breed, 'breed') || '';
    if (req.body?.age != null) updates.age = assertOptionalNumber(req.body?.age, 'age') ?? null;
    if (req.body?.medicalNotes != null)
      updates.medicalNotes = assertOptionalString(req.body?.medicalNotes, 'medicalNotes') || '';
    if (req.body?.vaccinationRecords != null)
      updates.vaccinationRecords = assertArray(req.body?.vaccinationRecords, 'vaccinationRecords');
    if (req.body?.ownerId != null) {
      const ownerId = assertNonEmptyString(req.body?.ownerId, 'ownerId');
      const owner = await requireClientOwner(ownerId);
      updates.ownerId = ownerId;
      updates.ownerName = owner?.name || '';
      updates.ownerNameLower = normalizeLower(owner?.name || '');
    }

    updates.updatedAt = getAdmin().firestore.FieldValue.serverTimestamp();

    await ref.update(updates);
    const updated = await ref.get();
    res.json({ pet: updated.data() });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

