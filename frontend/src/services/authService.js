import api from "./api";

export const loginUser = (email, password) => api.post("/auth/login", { email, password });
export const signupUser = (name, email, password) => api.post("/auth/signup", { name, email, password });
export const getMe = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);
export const uploadProfilePhoto = (formData) => api.post("/auth/profile/photo", formData, { headers: { "Content-Type": "multipart/form-data" } });
