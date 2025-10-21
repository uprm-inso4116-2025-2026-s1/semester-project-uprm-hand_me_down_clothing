export const validators = {
  first: (v: string) => (v.trim() ? "" : "Please enter your first name"),
  last: (v: string) => (v.trim() ? "" : "Please enter your last name"),
  email: (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? ""
      : "Please enter your email address.",
  password: (v: string) =>
    /^(?=.*[0-9!@#$%^&*]).{8,}$/.test(v)
      ? ""
      : "A number or symbol, at least 8 characters.",
};
