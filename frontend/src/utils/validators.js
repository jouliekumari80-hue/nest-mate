export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordMinLength = 6;

export const validateEmail = (email) => emailRegex.test(email) || "Invalid email";
export const validatePassword = (pw) => pw.length >= passwordMinLength || `Min ${passwordMinLength} characters`;
export const validateRequired = (v) => (v && v.trim()) || "Required";
