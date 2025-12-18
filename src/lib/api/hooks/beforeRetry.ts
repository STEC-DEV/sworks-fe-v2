import ky, { BeforeRetryHook, HTTPError } from "ky";
import Cookies from "js-cookie";
import api, { instance } from "../api-manager";
import { CustomResponseType } from "@/types/api";
import { decryptCookie } from "@/lib/crypt-cookie";
import { useAuthStore } from "@/store/auth/auth-store";
import { getTime } from "@/lib/time";
import { c } from "@/middleware";
import { logout } from "@/app/server-action/auth/auth-action";
import { notifyApiError } from "../errorHandler";

const DEFAULT_API_RETRY_LIMIT = 3;
const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  console.log("=== RETRY 에러 발생 ===");
  const httpError = error as HTTPError;
  console.log("재시도 횟수:", retryCount);
  console.log("요청 URL:", request.url);

  // 401이 아니면 리턴
  if (httpError.response.status !== 401) return;

  // 재시도 횟수 초과
  if (retryCount === DEFAULT_API_RETRY_LIMIT - 1) {
    return ky.stop;
  }

  console.log("⚠️ AccessToken 만료 - 토큰 갱신 시도");

  // 쿠키 확인
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  const cryptMode = Cookies.get("s-agent");

  if (!refreshToken || !cryptMode) {
    console.log(
      `${c.cyan}[${getTime()}]${c.r}❌ RefreshToken 또는 모드 정보 없음`
    );
    return ky.stop;
  }

  const mode = decryptCookie(cryptMode);
  if (!mode) {
    console.log(`${c.cyan}[${getTime()}]${c.r}❌ 복호화 실패`);
    return ky.stop;
  }
  console.log("재발급 시 로그인 모드 : ", mode);

  try {
    // 토큰 갱신 요청
    const res = await ky.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Login/W/WebRefreshToken`,
      {
        json: {
          accessToken,
          refreshToken,
          mode: mode === "True" ? true : false,
        },
        timeout: 10000,
        retry: 0,
      }
    );

    const data: CustomResponseType<Record<string, string>> = await res.json();

    const newAccessToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;

    Cookies.set("accessToken", newAccessToken);
    Cookies.set("refreshToken", newRefreshToken);
    request.headers.set("Authorization", `Bearer ${newAccessToken}`);

    const { enteredWorkplace } = useAuthStore.getState();
    if (enteredWorkplace) {
      request.headers.set("SiteSeq", enteredWorkplace.siteSeq.toString());
    }

    console.log("✅ 토큰 갱신 성공");
  } catch (err) {
    const error = err as HTTPError;
    console.log("❌ 토큰 갱신 실패");

    // ⭐ RefreshToken API의 응답만 체크
    if (error.response) {
      try {
        const refreshError = await error.response.clone().json();
        console.log("📄 RefreshToken API 응답:", refreshError);

        // session_expired면 모달 표시
        if (refreshError.error === "session_expired") {
          console.log(
            `${c.cyan}[${getTime()}]${c.r}❌ 세션 만료 - 재로그인 필요`
          );

          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          Cookies.remove("s-agent");

          notifyApiError({
            status: 401,
            message: "세션이 만료되었습니다. 다시 로그인해주세요.",
            response: error.response,
            data: { error: "session_expired" },
          });

          return ky.stop;
        }
      } catch (parseErr) {
        console.log("❌ 응답 파싱 실패:", parseErr);
      }
    }

    // 기본 처리 (네트워크 에러 등)
    console.log(`${c.cyan}[${getTime()}]${c.r}❌ RefreshToken 갱신 실패`);
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("s-agent");

    return ky.stop;
  }
};

export default beforeRetry;
