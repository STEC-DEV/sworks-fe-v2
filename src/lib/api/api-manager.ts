import ky from "ky";
import setAuthorizationHeader from "./hooks/setAuthorization";
import beforeRetry from "./hooks/beforeRetry";
import { notifyApiError } from "./errorHandler";

export const instance = ky.create({
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
        const retryCount = (request as any).retryCount || 0;

        // 401이고 retry가 모두 실패한 경우에만 모달 표시
        if (response.status === 401 && retryCount >= 3) {
          let errorData = null;
          try {
            errorData = await response.clone().json();
          } catch {
            errorData = null;
          }
          if (errorData?.error === "session_expired") {
            notifyApiError({
              status: 401,
              message: "토큰이 만료되었습니다.",
              response,
              data: errorData,
            });
          }
        }
        return response;
      },
    ],
  },
});

export default api;
