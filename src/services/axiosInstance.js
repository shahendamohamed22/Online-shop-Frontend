import axios from "axios";
import baseUrl from "./Api";

// Instance واحدة تستخدم في كل نداءات الـ API بدل axios العادي مباشرة.
// أي endpoint محتاج تسجيل دخول (Authorization: Bearer ...) بيتظبط هنا تلقائي
// من غير ما نكتب الـ header يدوي في كل ملف.
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
