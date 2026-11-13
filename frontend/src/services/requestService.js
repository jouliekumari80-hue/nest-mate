import api from "./api";

export const sendRequest = (data) => api.post("/requests/send", data);
export const acceptRequest = (id) => api.patch(`/requests/${id}/accept`);
export const rejectRequest = (id) => api.patch(`/requests/${id}/reject`);
export const cancelRequest = (id) => api.patch(`/requests/${id}/cancel`);
export const deleteRequest = (id) => api.delete(`/requests/${id}`);
export const getReceivedRequests = () => api.get("/requests/received");
export const getSentRequests = () => api.get("/requests/sent");
export const getRequestCount = () => api.get("/requests/count");
