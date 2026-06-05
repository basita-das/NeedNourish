import api from "../api/axios";

export const foodService = {
  // 1. GET a single listing (Required for the Edit Form to load data)
  getFoodDetail: async (id) => {
    const response = await api.get(`/food/${id}`);
    return response.data;
  },

  createListing: async (foodData) => {
    const response = await api.post("/food/", foodData);
    return response.data;
  },

  getNearby: async (lat, lon, radius = 5000) => {
    const response = await api.get("/food/nearby", {
      params: { lat, lon, radius },
    });
    return response.data;
  },

  claimFood: async (id) => {
    const response = await api.post(`/food/${id}/claim`);
    return response.data;
  },

  verifyPickup: async (id, code) => {
    const response = await api.post(`/food/${id}/verify?code=${code}`);
    return response.data;
  },

  // 2. UPDATE existing listing
  updateListing: async (id, data) => {
    const response = await api.patch(`/food/${id}`, data);
    return response.data;
  },

  // 3. DELETE a listing
  deleteListing: async (id) => {
    await api.delete(`/food/${id}`);
  },
};
