export interface LoginResult {
  success: boolean;
  token?: string;
  message?: string;
  remainingAttempts?: number;
  lockedUntil?: number;
}

export interface SecurityStatus {
  status: string;
  securityVersion: string;
  protections: {
    serverSideAuth: boolean;
    timingSafeComparison: boolean;
    rateLimiting: boolean;
    maxAllowedAttempts: number;
    lockoutDurationMinutes: number;
    sessionTokenTtlHours: number;
    activeSessionsCount: number;
    zeroClientPlaintextExposure: boolean;
    xssSanitization: boolean;
  };
}

/**
 * Perform server-side administrator authentication with brute force protection.
 * Password is sent strictly over the API payload to the server and never kept in client memory or state.
 */
export async function apiLogin(password: string): Promise<LoginResult> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: data.message || 'Authentication failed. Please check credentials.',
        remainingAttempts: data.remainingAttempts,
        lockedUntil: data.lockedUntil
      };
    }

    return {
      success: true,
      token: data.token,
      message: data.message
    };
  } catch (err) {
    console.error('Network or server error during authentication:', err);
    return {
      success: false,
      message: 'Unable to reach secure authentication service. Please try again.'
    };
  }
}

/**
 * Verify if an existing session token is active and valid on the server.
 */
export async function apiVerifyToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch('/api/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.valid);
  } catch {
    return false;
  }
}

/**
 * Log out of active admin session on the server.
 */
export async function apiLogout(token: string | null): Promise<void> {
  if (!token) return;
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (err) {
    console.warn('Logout network notice:', err);
  }
}

/**
 * Fetch real-time security posture status from server.
 */
export async function fetchSecurityStatus(): Promise<SecurityStatus | null> {
  try {
    const res = await fetch('/api/security/status');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fail silently in offline or dev bootstrapping
  }
  return null;
}

/**
 * Sanitize strings to strip script tags and dangerous HTML characters, protecting against XSS.
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, (tag) => (tag === '<' ? '&lt;' : '&gt;'))
    .trim();
}

/**
 * Validate URL string to prevent javascript: or malicious protocol execution.
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('data:image/')) return true;
  return /^https?:\/\//i.test(trimmed);
}
