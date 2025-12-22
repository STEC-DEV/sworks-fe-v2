"use server";

import { decryptCookie, encryptCookie } from "@/lib/crypt-cookie";
import { JWTVerified } from "@/lib/jwt-verifiied";
import { getTime } from "@/lib/time";
import { c } from "@/middleware";
import { useAuthStore } from "@/store/auth/auth-store";
import { useSSENotificationStore } from "@/store/normal/sse-store";
import { Response, ReturnToken } from "@/types/common/response";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export interface LoginResponse {
  message: string;
  result: boolean;
  url?: string;
  code: number;
}

/**
 * 관리자모드 로그인
 * @param data
 * @returns
 */
export async function LoginAction(
  data: Record<string, string>,
  adminMode: boolean
): Promise<LoginResponse> {
  const cookie = await cookies();
  let redirectUrl: string | null = null;

  try {
    console.log({ ...data, mode: adminMode });
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Login/w/Login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, mode: adminMode }),
      }
    );

    const returnData: LoginResponse = {
      result: false,
      message: "아이디 비밀번호를 확인해주세요.",
      url: "",
      code: 401,
    };
    //로그인 실패
    if (!res.ok) return returnData;

    const result: Response<ReturnToken> = await res.json();

    //최초 로그인 시 패스워드 변경
    if (result.code === 199) {
      returnData.message = "비빌변호 변경";
      returnData.result = true;
      returnData.url = "/login";
      returnData.code = 199;
      return returnData;
    }

    //일반모드
    if (!adminMode) {
      //일반모드 일반사용자 -> 메인화면 접속
      if (result.code === 200 || result.code === 201 || result.code === 202) {
        returnData.message = "로그인 성공";
        returnData.result = true;
        returnData.url = "/schedule";
        returnData.code = result.code;
      }
      //일반모드 관리자 -> 사업장 선택화면 이동
      if (result.code === 100) {
        returnData.message = "로그인 성공";
        returnData.result = true;
        returnData.url = "/select-workplace";
        returnData.code = 101;
      }
    } else {
      //일반 근무자가 관리모드 접속하는 경우
      if (result.code === 200 || result.code === 201 || result.code === 202) {
        returnData.message = "접근권한 없음";
        returnData.code = result.code;
      }
      //관리자 모드 로그인
      else {
        returnData.message = "로그인 성공";
        returnData.result = true;
        returnData.url = "/admin/workplace";
        returnData.code = result.code;
      }
    }

    //로그인 성공
    const { accessToken, refreshToken } = result.data;
    const payload = await JWTVerified(accessToken);
    console.log(
      `${c.cyan}[${getTime()}]${c.r} ${c.bgYellow}${c.green}${
        c.bold
      } ✅ LOGIN [${adminMode ? "관리" : "사업장"}] ${c.r} ${
        payload.UserType
      } ${payload.UserSeq}`
    );

    const cryptMode = encryptCookie(payload.mode ? "true" : "false");
    console.log("쿠키:", cryptMode);
    const de = decryptCookie(cryptMode);
    console.log("복호화값", de);

    cookie.set("s-agent", cryptMode);
    cookie.set("accessToken", accessToken);
    cookie.set("refreshToken", refreshToken);
    return returnData;
  } catch (error) {
    console.log(error);
    redirectUrl = "/login";
    return { result: false, message: "로그인 실패", code: 500 };
  }
}

/**
 * 일반모드 로그인
 * @param data
 */
export async function normalModeLoginAction(data: Record<string, string>) {
  const cookie = await cookies();
  const redirectUrl: string | null = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/login/w/login`
    );
  } catch (err) {}
}

/**
 * 로그아웃
 */
export async function logout() {
  const cookie = await cookies();

  const accessToken = cookie.get("accessToken")?.value;
  if (!accessToken) return redirect("/login", RedirectType.replace);
  if (accessToken) {
    try {
      const payload = await JWTVerified(accessToken);
      console.log(
        `${c.cyan}[${getTime()}] ${c.r}${c.bgYellow}${c.bold} ❌ 로그아웃 ${
          c.r
        } ${payload.UserType} ${payload.UserSeq}`
      );
    } catch {
      console.log(
        `${c.cyan}[${getTime()}] ${c.r}${c.bgYellow}${c.bold} ❌ 로그아웃 ${
          c.r
        } (만료된 세션)`
      );
    }
  }

  cookie.delete("accessToken");
  cookie.delete("refreshToken");
  cookie.delete("s-agent");

  useAuthStore.getState().reset();

  useSSENotificationStore.getState().clearAllCounts();

  redirect("/login", RedirectType.replace);
}
