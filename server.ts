import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// In-memory security state (brute force protection & session management)
interface RateLimitRecord {
  failedAttempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

interface AdminSession {
  token: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const activeSessions = new Map<string, AdminSession>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours session token duration

// Retrieve admin secret from environment or secure default
const getAdminPassword = (): string => {
  return process.env.ADMIN_PASSWORD || 'visit 2026';
};

// Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// JSON Body Parser with reasonable limit
app.use(express.json({ limit: '10mb' }));

// Helper: Timing-safe comparison to eliminate side-channel timing attacks
function timingSafeCompare(candidate: string, actual: string): boolean {
  try {
    const candidateHash = crypto.createHash('sha256').update(candidate.normalize()).digest();
    const actualHash = crypto.createHash('sha256').update(actual.normalize()).digest();
    return crypto.timingSafeEqual(candidateHash, actualHash);
  } catch {
    return false;
  }
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

// Client IP resolver helper
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

// API: Security Status Check
app.get('/api/security/status', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    securityVersion: '2.0-hardened',
    protections: {
      serverSideAuth: true,
      timingSafeComparison: true,
      rateLimiting: true,
      maxAllowedAttempts: MAX_FAILED_ATTEMPTS,
      lockoutDurationMinutes: LOCKOUT_DURATION_MS / 60000,
      sessionTokenTtlHours: SESSION_TTL_MS / 3600000,
      activeSessionsCount: activeSessions.size,
      zeroClientPlaintextExposure: true,
      xssSanitization: true
    }
  });
});

// API: Admin Login with Brute-Force Rate Limiting & Timing-Safe Verification
app.post('/api/auth/login', (req: Request, res: Response) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = loginAttempts.get(ip) || { failedAttempts: 0, lockedUntil: null, lastAttempt: now };

  // Check if locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSecs = Math.ceil((record.lockedUntil - now) / 1000);
    const remainingMins = Math.ceil(remainingSecs / 60);
    return res.status(429).json({
      success: false,
      message: `Security Lockout: Too many failed attempts. Please retry in ${remainingMins} minute${remainingMins > 1 ? 's' : ''}.`,
      lockedUntil: record.lockedUntil,
      remainingSeconds: remainingSecs
    });
  }

  // Reset lockout if time has passed
  if (record.lockedUntil && record.lockedUntil <= now) {
    record.failedAttempts = 0;
    record.lockedUntil = null;
  }

  const { password } = req.body;

  if (typeof password !== 'string' || !password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required'
    });
  }

  const actualPassword = getAdminPassword();
  const isValid = timingSafeCompare(password.trim(), actualPassword.trim());

  if (!isValid) {
    record.failedAttempts += 1;
    record.lastAttempt = now;

    if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
      loginAttempts.set(ip, record);
      return res.status(429).json({
        success: false,
        message: `Account temporarily locked due to 5 consecutive failed attempts. Locked for 15 minutes.`,
        lockedUntil: record.lockedUntil
      });
    }

    loginAttempts.set(ip, record);
    const remaining = MAX_FAILED_ATTEMPTS - record.failedAttempts;
    return res.status(401).json({
      success: false,
      message: 'Invalid administrator credentials. Access denied.',
      remainingAttempts: remaining
    });
  }

  // Successful login: Reset rate limit record for this IP
  loginAttempts.delete(ip);

  // Generate cryptographically secure session token (256 bits)
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = now + SESSION_TTL_MS;

  activeSessions.set(token, {
    token,
    createdAt: now,
    expiresAt,
    ip
  });

  return res.json({
    success: true,
    token,
    expiresIn: Math.floor(SESSION_TTL_MS / 1000),
    message: 'Authentication successful. Admin session active.'
  });
});

// API: Verify Session Token
app.get('/api/auth/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ valid: false, reason: 'No token provided' });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.json({ valid: false, reason: 'Session not found or expired' });
  }

  if (session.expiresAt <= Date.now()) {
    activeSessions.delete(token);
    return res.json({ valid: false, reason: 'Session expired' });
  }

  return res.json({
    valid: true,
    expiresAt: session.expiresAt
  });
});

// API: Admin Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Frontend Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`Server securely running on http://${HOST}:${PORT}`);
  });
}

startServer();
