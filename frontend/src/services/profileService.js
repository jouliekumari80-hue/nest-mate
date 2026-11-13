import api from "./api";

export const toggleSaved = (listingId) => api.post("/saved/toggle", { listing: listingId });
export const getSavedListings = () => api.get("/saved");
export const checkSaved = (listingId) => api.get(`/saved/check/${listingId}`);
