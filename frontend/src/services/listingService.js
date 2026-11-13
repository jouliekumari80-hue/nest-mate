import api from "./api";

export const getListings = (params) => api.get("/listings", { params });
export const getListing = (id) => api.get(`/listings/${id}`);
export const createListing = (data) => api.post("/listings", data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);
export const toggleListingStatus = (id) => api.patch(`/listings/${id}/status`);
export const getMyListings = () => api.get("/listings/me/all");
export const uploadListingImages = (id, formData) => api.post(`/listings/${id}/images`, formData, { headers: { "Content-Type": "multipart/form-data" } });
