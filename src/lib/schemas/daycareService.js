import API from "../api";

export const getPendingDaycares = () => API.get("/provider/daycare/pending");

// ✅ Approve daycare
export const approveDaycare = (id) =>
  API.patch(`/provider/daycare/${id}/approve`);

// ✅ Reject daycare
export const rejectDaycare = (id) =>
  API.patch(`/provider/daycare/${id}/reject`);
