import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const API_V1_PREFIX =
  import.meta.env.VITE_API_V1_PREFIX;

const API_URL =
  `${API_BASE_URL}${API_V1_PREFIX}`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================================
// AUTOMATICALLY ATTACH ACCESS TOKEN
// =========================================

apiClient.interceptors.request.use(
  (config) => {
    const accessToken =
      localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;