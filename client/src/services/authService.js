import api from "../api/axios";

export const authService = {
  login: async (email, password, roleType) => {
    const formData = new FormData();
    formData.append("username", email); // FastAPI OAuth2 expects 'username'
    formData.append("password", password);

    const response = await api.post(`/${roleType}/login`, formData);
    return response.data;
  },

  registerSupplier: async (data) => {
    const response = await api.post("/suppliers/register", data);
    return response.data;
  },

  registerNeedy: async (data) => {
    const response = await api.post("/needies/register", data);
    return response.data;
  },
};
