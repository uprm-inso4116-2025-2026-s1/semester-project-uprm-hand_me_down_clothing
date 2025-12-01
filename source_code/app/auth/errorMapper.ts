// Lightweight auth error mapping and logging 
export function mapAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred.';
  const raw = (error?.message || '').toString();
  const msg = raw.toLowerCase();
  const status = error?.status || error?.statusCode || error?.code;

  if (status === 429 || msg.includes('too many requests') || msg.includes('rate limit')) {
    return 'Too many requests. Please try again in a few minutes.';
  }

  if (msg.includes('invalid login') || msg.includes('invalid credentials') || msg.includes('invalid password') || msg.includes('invalid email')) {
    return 'Invalid email or password.';
  }

  if (msg.includes('user not found') || msg.includes('no user') || msg.includes('not found')) {
    return 'No account found with that email address.';
  }

  if (msg.includes('expired') || msg.includes('expired token') || msg.includes('invalid token')) {
    return 'The code or link has expired. Request a new one and try again.';
  }

  if (msg.includes('network') || msg.includes('failed to send')) {
    return 'Network error. Please try again in a moment.';
  }

  // Fallback to original message when available but trimmed
  return raw || 'Something went wrong. Please try again.';
}

export function logAuthError(context: string, error: any) {
  // Keep logging lightweight and local
  try {
    console.error(`[auth:${context}]`, error);
  } catch {
    // ignore logging errors
  }
}
