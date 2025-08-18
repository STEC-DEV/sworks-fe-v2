"use server";

import { Response, ReturnToken } from "@/types/common/response";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

/**
 * 관리자모드 로그인
 * @param data
 * @returns
 */
export async function LoginAction(
  data: Record<string, string>,
  adminMode: boolean
) {
  console.log("======================");
  console.log("서버액션 관리자모드 로그인 값");
  console.log(data);
  console.log("======================");

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
    //로그인 실패
    if (!res.ok) return;

    const result: Response<ReturnToken> = await res.json();
    console.log(result);

    //일반모드
    if (!adminMode) {
      //일반모드 일반사용자 -> 메인화면 접속
      if (result.code === 201) {
        redirectUrl = "/facility/r&m";
      }
      //일반모드 관리자 -> 사업장 선택화면 이동
      if (result.code === 100) {
        redirectUrl = "/select-workplace";
      }
    } else {
      if (result.code === 201) return console.log("접근권한 없음");
      //관리자 모드
      redirectUrl = "/admin/workplace";
    }

    //로그인 성공
    const { accessToken, refreshToken } = result.data;

    cookie.set("accessToken", accessToken);
    cookie.set("refreshToken", refreshToken);
  } catch (error) {
    console.log(error);
    redirectUrl = "/login";
  }
  if (redirectUrl === null) redirectUrl = "/login";
  redirect(redirectUrl, RedirectType.replace);
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
