import ky from "ky";
import setAuthorizationHeader from "./hooks/setAuthorization";
import beforeRetry from "./hooks/beforeRetry";
import { notifyApiError } from "./errorHandler";

const instance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL,
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
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 409) {
          notifyApiError({
            status: 409,
            message: "토근이 만료되었습니다.",
            response,
          });
        }
        return response;
      },
    ],
  },
});

export default api;
