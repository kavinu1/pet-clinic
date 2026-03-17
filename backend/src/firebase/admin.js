const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let initialized = false;

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function normalizePrivateKey(privateKey) {
  if (typeof privateKey !== 'string') return privateKey;
  // Common when private keys are stored in env vars.
  return privateKey.includes('\\n') ? privateKey.replace(/\\n/g, '\n') : privateKey;
}

function isValidServiceAccount(serviceAccount) {
  if (!serviceAccount || typeof serviceAccount !== 'object') return false;
  if (typeof serviceAccount.private_key !== 'string' || !serviceAccount.private_key.trim()) return false;
  if (typeof serviceAccount.client_email !== 'string' || !serviceAccount.client_email.trim()) return false;
  return true;
}

function parseServiceAccountJson(jsonString) {
  const parsed = JSON.parse(jsonString);
  if (parsed && typeof parsed === 'object') {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed;
}

function resolveFromCwd(maybeRelativePath) {
  if (!maybeRelativePath) return null;
  return path.isAbsolute(maybeRelativePath) ? maybeRelativePath : path.resolve(process.cwd(), maybeRelativePath);
}

function loadServiceAccountFromFile(filePath) {
  const absPath = resolveFromCwd(filePath);
  if (!absPath || !fileExists(absPath)) return null;
  const contents = fs.readFileSync(absPath, 'utf8');
  const parsed = JSON.parse(contents);
  if (parsed && typeof parsed === 'object') {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed;
}

function loadServiceAccount() {
  const nodeEnv = process.env.NODE_ENV || '';
  const allowDevFallback = nodeEnv !== 'production';

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    // Support "@./path/to/serviceAccountKey.json" (keeps .env single-line without embedding secrets).
    if (serviceAccountJson.startsWith('@')) {
      const fromFile = loadServiceAccountFromFile(serviceAccountJson.slice(1));
      if (isValidServiceAccount(fromFile)) return fromFile;
      throw new Error(
        'Invalid Firebase service account file referenced by FIREBASE_SERVICE_ACCOUNT_JSON. ' +
          'Expected JSON with "private_key" and "client_email".'
      );
    }

    const parsed = parseServiceAccountJson(serviceAccountJson);
    if (isValidServiceAccount(parsed)) return parsed;

    // If FIREBASE_SERVICE_ACCOUNT_JSON is set but incomplete, try common local dev fallbacks.
    if (allowDevFallback) {
      // eslint-disable-next-line no-console
      console.warn(
        'FIREBASE_SERVICE_ACCOUNT_JSON is set but missing required fields ("private_key", "client_email"). ' +
          'Falling back to FIREBASE_SERVICE_ACCOUNT_FILE, ./serviceAccountKey.json, or ADC.'
      );
    } else {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_JSON is set but missing required fields ("private_key", "client_email"). ' +
          'Provide a full service account JSON (single line), or use GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_SERVICE_ACCOUNT_FILE.'
      );
    }
  }

  const serviceAccountFile = process.env.FIREBASE_SERVICE_ACCOUNT_FILE;
  if (serviceAccountFile) {
    const fromFile = loadServiceAccountFromFile(serviceAccountFile);
    if (isValidServiceAccount(fromFile)) return fromFile;
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_FILE is set but could not be read or is invalid. ' +
        'Expected JSON with "private_key" and "client_email".'
    );
  }

  if (allowDevFallback) {
    const defaultPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
    const fromDefault = loadServiceAccountFromFile(defaultPath);
    if (isValidServiceAccount(fromDefault)) return fromDefault;
  }

  return null;
}

function initFirebaseAdmin() {
  if (initialized) return admin;

  const serviceAccount = loadServiceAccount();
  const envProjectId = process.env.FIREBASE_PROJECT_ID;
  const serviceAccountProjectId =
    serviceAccount && typeof serviceAccount.project_id === 'string' ? serviceAccount.project_id : null;
  const projectId = envProjectId || serviceAccountProjectId || undefined;

  if (envProjectId && serviceAccountProjectId && envProjectId !== serviceAccountProjectId) {
    // eslint-disable-next-line no-console
    console.warn(
      `FIREBASE_PROJECT_ID (${envProjectId}) does not match service account project_id (${serviceAccountProjectId}).`
    );
  }

  if (serviceAccount) {
    const credential = admin.credential.cert(serviceAccount);
    admin.initializeApp({ credential, projectId });
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS or other ADC mechanisms.
    admin.initializeApp({ projectId });
  }

  initialized = true;
  return admin;
}

function getAdmin() {
  return initFirebaseAdmin();
}

function getDb() {
  return getAdmin().firestore();
}

module.exports = { getAdmin, getDb };
