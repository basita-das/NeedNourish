import api from "../api/axios";

export const supplierService = {
  getStats: async () => {
    const response = await api.get("/suppliers/me/stats");
    return response.data;
  },
  getInventory: async () => {
    const response = await api.get("/suppliers/me/inventory");
    return response.data;
  },
};
