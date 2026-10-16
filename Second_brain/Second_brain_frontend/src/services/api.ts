import axios from "axios";

// // const api = axios.create({
// //   baseURL: "http://localhost:8000/api/v1",
// //   headers: {
// //     "Content-Type": "application/json",
// //   },
// // });

// // export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api/v1",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   // console.log("========== API REQUEST ==========");
//   // console.log("URL:", config.url);
//   // console.log("TOKEN FROM LOCAL STORAGE:", token);

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;