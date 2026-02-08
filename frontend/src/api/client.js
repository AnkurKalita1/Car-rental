import axios from "axios";

const envBaseUrl = import.meta.env.VITE_API_URL;
const fallbackPorts = Array.from({ length: 10 }, (_, idx) => 5000 + idx);
const fallbackUrls = fallbackPorts.map((port) => `http://localhost:${port}/api`);

const baseUrls = envBaseUrl
  ? [envBaseUrl, ...fallbackUrls.filter((url) => url !== envBaseUrl)]
  : fallbackUrls;


const client = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
  timeout: 10000
});

const getBasePath = (url = "") => url.split("?")[0];

const isPublicRoute = (config) => {
  const basePath = getBasePath(config?.url || "");
  return (
    (config?.method === "get" && basePath === "/cars") ||
    (config?.method === "get" &&
      basePath.startsWith("/cars/") &&
      basePath.split("/").length === 3 &&
      !basePath.includes("/owner") &&
      !basePath.includes("/availability")) ||
    basePath.startsWith("/auth/")
  );
};

client.interceptors.request.use((config) => {
  // Always start from envBaseUrl if provided
  if (envBaseUrl) {
    config.baseURL = envBaseUrl;
    client.defaults.baseURL = envBaseUrl;
    config.__retryCount = 0;
  }
  const token = localStorage.getItem("token");
  // Only send token for protected routes
  if (token && !isPublicRoute(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.method === "patch" && config.url?.includes("/bookings/")) {
    const fullUrl = `${config.baseURL || client.defaults.baseURL || ""}${config.url}`;
    console.info("API PATCH:", fullUrl, "payload:", config.data);
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Clear invalid token for protected routes only
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (!isPublicRoute(config)) {
        localStorage.removeItem("token");
      }
    }

    if (!config) {
      return Promise.reject(error);
    }

    const retryCount = config.__retryCount || 0;
    const isNetworkError = !error.response;
    const isPublic403 = error.response?.status === 403 && isPublicRoute(config);

    if (config.__noRetry) {
      return Promise.reject(error);
    }

    if ((!isNetworkError && !isPublic403) || retryCount >= baseUrls.length - 1) {
      return Promise.reject(error);
    }

    const nextIndex = retryCount + 1;
    const nextBaseUrl = baseUrls[nextIndex];
    config.__retryCount = nextIndex;
    config.baseURL = nextBaseUrl;
    client.defaults.baseURL = nextBaseUrl;

    return client.request(config);
  }
);

export default client;
