// // import axios from "axios";
// // import systemConfig from '@/config/system/index.js'

// // const commonConfig = {
// //   headers: {
// //     "Content-Type": "application/json",
// //     Accept: "application/json",
// //   },
// // };

// // const createApiClient = (baseURL) => {
// //   axios.defaults.headers = commonConfig
// //   const instance = axios.create({
// //     baseURL,
// //     withCredentials: true,
// //   });

// //   instance.interceptors.response.use(async (response) => {
// //     const config = response.config
// //     if (config.url.indexOf('/login') >= 0 || config.url.indexOf('/refresh-token') >= 0) {
// //       return response
// //     }

// //     const { code, message } = response.data
// //     if (code && code === 401) {
// //       if (message && (message === 'jwt expired' || message === 'jwt required')) {
// //         try {
// //           await refreshToken()
// //           return instance(config)
// //         }
// //         catch (err) {
// //           return Promise.reject(err)
// //         }
// //       }
// //     }
// //     return response
// //   }, err => {
// //     return Promise.reject(err)
// //   })

// //   return instance
// // };

// // async function refreshToken() {
// //   const api = createApiClient(`/${systemConfig.apiPrefix}/${systemConfig.adminPrefix}/auth`)
// //   return (await api.patch('/refresh-token')).data
// // }

// // export default createApiClient


// import axios from "axios";

// // Hàm tiện ích để lưu JWT vào cookie
// function setCookie(name, value, days) {
//   let expires = "";
//   if (days) {
//     const date = new Date();
//     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//     expires = "; expires=" + date.toUTCString();
//   }
//   document.cookie = name + "=" + (value || "") + expires + "; path=/; Secure; SameSite=Strict";
// }

// // Hàm tiện ích để lấy cookie
// function getCookie(name) {
//   const nameEQ = name + "=";
//   const ca = document.cookie.split(';');
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === ' ') c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
//   }
//   return null;
// }

// const commonConfig = {
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// };

// // Tạo một client API với Bearer Token
// const createApiClient = (baseURL) => {
//   // Thiết lập cấu hình mặc định cho axios
//   axios.defaults.headers = commonConfig;

//   // Tạo một instance mới của axios
//   const instance = axios.create({
//     baseURL,
//   });

//   // Thêm Interceptor để thêm Bearer Token vào mỗi yêu cầu, trừ endpoint /login
//   instance.interceptors.request.use(
//     (config) => {
//       // Nếu đường dẫn không phải là /login, thêm Bearer Token từ cookie
//       if (!config.url.includes('/login')) {
//         const token = getCookie('jwtToken'); // Lấy token từ cookie
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//       }

//       return config;
//     },
//     (err) => {
//       return Promise.reject(err);
//     }
//   );

//   // Interceptor để xử lý các phản hồi
//   instance.interceptors.response.use(
//     (response) => {
//       // Nếu yêu cầu là đăng nhập và thành công, lưu token vào cookie
//       if (response.config.url.includes('/login') && response.status === 200) {
//         const token = response.data.token; // Giả sử token được trả về dưới dạng response.data.token
//         if (token) {
//           setCookie('jwtToken', token, 7); // Lưu token vào cookie với thời hạn 7 ngày
//         }
//       }
//       return response;
//     },
//     (err) => {
//       // Xử lý lỗi
//       return Promise.reject(err);
//     }
//   );

//   return instance;
// };

// // Không cần hàm refreshToken nữa

// export default createApiClient;

import axios from "axios";

const commonConfig = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const createApiClient = (baseURL) => {
  axios.defaults.headers = commonConfig;

  const instance = axios.create({
    baseURL,
    withCredentials: true, 
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      console.log(err)
      return Promise.reject(err);
    }
  );

  return instance;
};

export default createApiClient;
