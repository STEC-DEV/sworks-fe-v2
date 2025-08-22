"use server";

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/Login/W/Login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data }),
      }
    );
    const returnData: LoginResponse = {
      result: false,
      message: "로그인 실패",
      url: "",
      code: 500,
    };
    //로그인 실패
    if (!res.ok) return returnData;

    const result: Response<ReturnToken> = await res.json();
    console.log(result);

    //일반모드
    if (!adminMode) {
      //일반모드 일반사용자 -> 메인화면 접속
      if (result.code === 201) {
        returnData.message = "로그인 성공";
        returnData.result = true;
        returnData.url = "/facility/r&m";
        returnData.code = result.code;
      }
      //일반모드 관리자 -> 사업장 선택화면 이동
      if (result.code === 100) {
        returnData.message = "로그인 성공";
        returnData.result = true;
        returnData.url = "/select-workplace";
        returnData.code = result.code;
      }
    } else {
      //일반 근무자가 관리모드 접속하는 경우
      if (result.code === 201) {
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
  console.log("======================");
  console.log("서버액션 일반모드 로그인 값");
  console.log(data);
  console.log("======================");
  const cookie = await cookies();
  let redirectUrl: string | null = null;
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

  cookie.delete("accessToken");
  cookie.delete("refreshToken");

  redirect("/login", RedirectType.replace);
}
