export function validateEmail (email: string) {
  // simple email regex - good for client validation only
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
