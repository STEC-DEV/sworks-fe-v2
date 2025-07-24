import ky, { BeforeRetryHook, HTTPError } from "ky";
import Cookies from "js-cookie";
import api from "../api-manager";
import { CustomResponseType } from "@/types/api";

const DEFAULT_API_RETRY_LIMIT = 3;

const beforeRetry: BeforeRetryHook = async ({ request, error, retryCount }) => {
  console.log("retry 에러 발생");
  const httpError = error as HTTPError;
  console.log(httpError.response.status);
  //AUTH 에러 아닐 시 리턴
  if (httpError.response.status !== 401) return;

  if (retryCount === DEFAULT_API_RETRY_LIMIT - 1) {
    return ky.stop;
  }

  /**
   * 토큰 재발급 요청
   */

  const refreshToken = Cookies.get("refreshToken");

  console.log("기존 토큰");
  console.log(refreshToken);

  const res = await api.post("Login/W/WebRefreshToken", {
    json: { refreshToken },
  });

  const data: CustomResponseType<Record<string, string>> = await res.json();

  const newAccessToken = data.data.accessToken;
  const newRefreshToken = data.data.refreshToken;

  Cookies.set("accessToken", newAccessToken);
  Cookies.set("refreshToken", newRefreshToken);
};

export default beforeRetry;
