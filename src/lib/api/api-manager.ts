import ky from "ky";
import setAuthorizationHeader from "./hooks/setAuthorization";
import beforeRetry from "./hooks/beforeRetry";

const instance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
});

const api = instance.extend({
  timeout: false,
  retry: {
    statusCodes: [401], //401 에러일 때 재시도
    methods: ["get", "post", "put", "delete", "patch"], // 재시도를 적용할 HTTP 메서드
    backoffLimit: 3 * 1000, // 재시도 간격의 최댓값
  },
  hooks: {
    beforeRequest: [setAuthorizationHeader],
    beforeRetry: [beforeRetry],
  },
});

export default api;
