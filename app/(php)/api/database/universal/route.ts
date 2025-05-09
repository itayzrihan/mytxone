import admin from 'firebase-admin';
import { NextResponse, NextRequest } from 'next/server';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    // Check if all required service account details are present
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      console.error('Missing Firebase Admin SDK configuration details in environment variables.');
    } else {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase Admin initialized.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
  }
} else {
  console.log('Firebase Admin already initialized.');
}

// Base URL for your PHP backend endpoint (adjust as needed)
const PHP_BACKEND_BASE_URL = process.env.PHP_BACKEND_BASE_URL || 'https://heybos.com/apiphp';

// The secret key to send to the PHP backend (should match YOUR_SUPER_SECRET_KEY)
const PHP_SECRET_KEY = process.env.PHP_SECRET_KEY || 'YOUR_SUPER_SECRET_KEY';

// Helper to set CORS headers on the response
const setCorsHeaders = (response: NextResponse, origin: string | null) => {
  response.headers.set('Access-Control-Allow-Origin', origin || '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, PUT, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Secret-Key');
};

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('Origin');
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response, origin);
  console.log('[OPTIONS] Preflight request received. Responding with headers:', response.headers);
  return response;
}

// Authenticate the user using Firebase ID token
async function authenticate(request: NextRequest, uidParam: string) {
  const origin = request.headers.get('Origin');
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    const res = NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
    setCorsHeaders(res, origin);
    console.error('[AUTH] Missing Authorization header.');
    return res;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log('[AUTH] Token decoded successfully:', decoded);
    if (decoded.uid !== uidParam) {
      const res = NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      setCorsHeaders(res, origin);
      console.error('[AUTH] Forbidden: token uid does not match request uid.');
      return res;
    }
    return null;
  } catch (error) {
    const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    setCorsHeaders(res, origin);
    console.error('[AUTH] Token verification failed:', error);
    return res;
  }
}

async function forwardToPhp(request: NextRequest, endpoint: string): Promise<NextResponse> {
  const origin = request.headers.get('Origin');
  const url = `${PHP_BACKEND_BASE_URL}/${endpoint}?${new URL(request.url).searchParams.toString()}`;
  const body = await request.text();
  const init: RequestInit = {
    method: 'POST', // Force POST for the PHP endpoint
    headers: {
      'Content-Type': 'application/json',
      'Authorization': request.headers.get('Authorization') || '',
      'X-Secret-Key': PHP_SECRET_KEY,
    },
    body,
  };

  console.log('[FORWARD] Forwarding request to PHP endpoint:', url);
  console.log('[FORWARD] Request init object:', init);

  try {
    const phpRes = await fetch(url, init);
    console.log('[FORWARD] PHP backend responded with status:', phpRes.status);
    const responseText = await phpRes.text();
    console.log('[FORWARD] Raw response from PHP backend:', responseText);

    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (err) {
      console.error('[FORWARD] Error parsing JSON from PHP backend:', err);
      data = { error: 'Invalid JSON returned from PHP backend', raw: responseText };
    }

    console.log('[FORWARD] Parsed data from PHP backend:', data);
    const response = NextResponse.json(data, { status: phpRes.status });
    setCorsHeaders(response, origin);
    return response;
  } catch (error) {
    console.error('[FORWARD] Error forwarding request to PHP:', error);
    const response = NextResponse.json({ error: 'Error forwarding request to PHP', details: error });
    setCorsHeaders(response, origin);
    return response;
  }
}

// Main handler for POST requests
export async function POST(request: NextRequest) {
  const origin = request.headers.get('Origin');
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  if (!uid) {
    const res = NextResponse.json({ error: 'Missing uid parameter' }, { status: 400 });
    setCorsHeaders(res, origin);
    console.error('[POST] Missing uid parameter.');
    return res;
  }
  console.log('[POST] Request received for uid:', uid);

  const authError = await authenticate(request, uid);
  if (authError) {
    console.error('[POST] Authentication error:', authError);
    return authError;
  }

  return forwardToPhp(request, 'universal.php');
}

// Handle PUT requests by aliasing them to the POST logic
export async function PUT(request: NextRequest) {
  console.log('[PUT] Request received, aliasing to POST.');
  return POST(request);
}
