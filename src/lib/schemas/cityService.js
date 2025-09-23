import API from "../api";


export const getCities = () => API.get("/cities");

export const getCity = (slug) => API.get(`/cities/${slug}`);

export const createCity = (data) => API.post("/cities", data);
