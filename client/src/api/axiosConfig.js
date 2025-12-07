import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,  // send cookies automatically
});

// ensure *every request* shares cookies
api.defaults.withCredentials = true;

// optional: default headers
api.defaults.headers.common["Content-Type"] = "application/json";

export default api;
