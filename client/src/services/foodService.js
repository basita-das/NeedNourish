import api from "../api/axios";

export const foodService = {
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
    // Sends code as a query parameter as defined in our Backend Router
    const response = await api.post(`/food/${id}/verify?code=${code}`);
    return response.data;
  },
};
