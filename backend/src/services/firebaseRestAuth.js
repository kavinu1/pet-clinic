const https = require('https');

const { badRequest } = require('../utils/httpErrors');

function validateFirebaseWebApiKey(apiKey) {
  if (!apiKey) throw badRequest('Missing FIREBASE_WEB_API_KEY on server');

  const trimmed = String(apiKey).trim();
  // Common misconfiguration: setting appId instead of apiKey.
  if (/^\d+:\d+:(web|android|ios):/.test(trimmed)) {
    throw badRequest(
      'Invalid FIREBASE_WEB_API_KEY: looks like a Firebase App ID (appId). ' +
        'Set FIREBASE_WEB_API_KEY to the Web API key (apiKey) from Firebase Console → Project settings → General.'
    );
  }

  // Google API keys typically start with "AIza". Enforce to catch obvious mistakes early.
  if (!/^AIza[0-9A-Za-z_-]{20,}$/.test(trimmed)) {
    throw badRequest(
      'Invalid FIREBASE_WEB_API_KEY format. ' +
        'Set FIREBASE_WEB_API_KEY to the Web API key (apiKey) from Firebase Console → Project settings → General.'
    );
  }

  return trimmed;
}

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const payload = Buffer.from(JSON.stringify(body));
    const request = https.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': payload.length,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const json = data ? JSON.parse(data) : {};
            if (res.statusCode && res.statusCode >= 400) {
              const message = json?.error?.message;
              if (typeof message === 'string' && message.toLowerCase().includes('api key')) {
                return reject(badRequest('Invalid FIREBASE_WEB_API_KEY', json));
              }
              return reject(badRequest('Invalid credentials', json));
            }
            return resolve(json);
          } catch (e) {
            return reject(e);
          }
        });
      }
    );
    request.on('error', reject);
    request.write(payload);
    request.end();
  });
}

async function signInWithEmailPassword({ email, password, apiKey }) {
  const validatedApiKey = validateFirebaseWebApiKey(apiKey);
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${validatedApiKey}`;
  return postJson(url, { email, password, returnSecureToken: true });
}

module.exports = { signInWithEmailPassword };
