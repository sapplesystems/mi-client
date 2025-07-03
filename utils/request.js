import axios from "axios";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "X-Requested-With": "XMLHttpRequest", Accept: "application/json" },
});

const clearUserSessionInfoLocalStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

/**
 * Extract bearer token from the request Authorization header
 * @param req
 */
const parseBearerToken = (req) => {
  const auth = req.headers ? req.headers.Authorization || null : null;
  if (!auth) {
    return null;
  }

  const parts = auth.split(" ");
  // Malformed header
  if (parts.length < 2) {
    return null;
  }

  const schema = parts.shift().toLowerCase();
  const token = parts.join(" ");
  if (schema !== "bearer") {
    return null;
  }

  return token;
};

const setDefaultHeaders = () => {
  client.defaults.headers = {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  };
};

const signOut = (redirect = true) => {
  setDefaultHeaders();
  clearUserSessionInfoLocalStorage();
  if (redirect) {
    window.location = "/login";
  }
};

const login = (username, password, token) => {
  // Reset default headers to avoid sending Authorization header
  setDefaultHeaders();
  clearUserSessionInfoLocalStorage();

  return client
    .post("/api/v1/login/", { username, password, token })
    .then((response) => {
      clearUserSessionInfoLocalStorage();
      localStorage.setItem("accessToken", response.data.access_token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      return Promise.resolve(response.data);
    })
    .catch((error) => {
      // Handle errors if needed
      return Promise.reject(error);
    });
};

const graphqlLogin = (username, password) => {
  const query = `mutation {tokenAuth(username: "${username}", password: "${password}") {token payload refreshExpiresIn}}`;
  return client.post("/graphql", { query }).then((response) => {
    if (response?.data?.errors?.length > 0) {
      return Promise.reject(response?.data?.errors[0]);
    } else {
      clearUserSessionInfoLocalStorage();
      localStorage.setItem("accessToken", response?.data?.data?.tokenAuth?.token);
      return Promise.resolve(response.data);
    }
  });
};

// const getRefreshToken = () => {
//   return client.post("/api/v1/refresh-token/", { refresh: localStorage.getItem("refreshToken") }).then((response) => {
//     const userInfo = response.data;
//     localStorage.setItem("accessToken", userInfo.access);
//     client.defaults.headers.Authorization = `Bearer ${response.data.access}`;
//     return Promise.resolve(response.data);
//   });
// };

const getRefreshToken = async () => {
  try {
    const response = await client.post("/api/v1/refresh-token/", {
      refresh: localStorage.getItem("refreshToken"),
    });

    const { access } = response.data;

    localStorage.setItem("accessToken", access);
    client.defaults.headers.Authorization = `Bearer ${access}`;

    return response.data;
  } catch (error) {
    throw error;
  }
};

const apiResponseSuccessInterceptor = async (response) => {
  return response;
};

let isRefreshing = false;
const apiResponseErrorInterceptor = async (error) => {
  if (
    error?.response?.status === 401 &&
    !window.location.pathname.includes("login") &&
    !window.location.pathname.includes("password") &&
    !window.location.pathname.includes("register") &&
    window.location.pathname !== "/" &&
    window.location.pathname !== "/about-us" &&
    window.location.pathname !== "/contact-us" &&
    window.location.pathname !== "/privacy-policy"
  ) {
    const originalRequest = error.config;
    const originalReqAccessToken = parseBearerToken(originalRequest);

    if (originalReqAccessToken && !isRefreshing) {
      isRefreshing = true;

      try {
        await getRefreshToken();
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`;
        return client.request(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        await signOut();
      }
    }

    await signOut();
    error["response"]["data"]["error"] = "Session expired!";
  } else if (
    (error && error?.response?.status === 403) ||
    (error && error?.response?.data?.messages && error?.response?.data?.messages[0]?.token_class === "AccessToken")
  ) {
    error["response"]["data"]["error"] = error?.response?.data?.detail;
  }

  return Promise.reject(error);
};

client.interceptors.response.use(apiResponseSuccessInterceptor, apiResponseErrorInterceptor);

const apiRequest = (options) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    client.defaults.headers.Authorization = `Bearer ${accessToken}`;
  }

  const onSuccess = (response) => response;
  const onError = (error) => Promise.reject(error.response || error.message);

  return client.request(options).then(onSuccess).catch(onError);
};

const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
};

export { login, signOut, getRefreshToken, isLoggedIn, graphqlLogin };

export default apiRequest;
