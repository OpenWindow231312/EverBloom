import API from "./api";

export const getAllFlowers = () => API.get("/shop");
export const getFlowerById = (id) => API.get(`/shop/${id}`);
