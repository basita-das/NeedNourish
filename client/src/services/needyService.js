import api from "../api/axios";

export const needyService = {
  // GET /needies/me/history
  getHistory: async () => {
    const response = await api.get("/needies/me/history");
    return response.data;
  },

  // GET /needies/me
  getProfile: async () => {
    const response = await api.get("/needies/me");
    return response.data;
  },
};
