import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const loading = useState("loading", () => false);

  const api = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    params: {
      api_key: config.public.tmdbApiKey,
      language: "en-US"
    }
  });

  // Request Interceptor
  api.interceptors.request.use(
    (request) => {
      loading.value = true; // ✅ Show loader
      request.metadata = { startTime: new Date().getTime() }; // ✅ Track start time
      return request;
    },
    (error) => {
      loading.value = false; // ✅ Hide loader on request error
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  api.interceptors.response.use(
    (response) => {
      const minDelay = 500; 
      const elapsedTime = new Date().getTime() - response.config.metadata.startTime;
      const remainingTime = Math.max(minDelay - elapsedTime, 0);

      setTimeout(() => {
        loading.value = false;
      }, remainingTime);

      return response.data;
    },
    (error) => {
      loading.value = false;

      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error("Bad Request: Check your API parameters.");
            break;
          case 401:
            console.error("Unauthorized: Invalid API key.");
            break;
          case 403:
            console.error("Forbidden: You don’t have permission.");
            break;
          case 404:
            console.error("Not Found: Resource does not exist.");
            break;
          case 500:
            console.error("Server Error: Try again later.");
            break;
          default:
            console.error("Unexpected API error:", error.response.status);
        }
      } else if (error.request) {
        console.error("No response received from TMDb API.");
      } else {
        console.error("Error setting up API request:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api
    }
  };
});
