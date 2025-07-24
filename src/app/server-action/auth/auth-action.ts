"use server";

import { POST } from "@/app/api/auth/admin/route";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

/**
 * 관리자모드 로그인
 * @param data
 * @returns
 */
export async function adminModeLoginAction(data: Record<string, string>) {
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
    console.log("로그인 성공");
    //로그인 성공
    const { accessToken, refreshToken } = (await res.json()).data;

    cookie.set("accessToken", accessToken);
    cookie.set("refreshToken", refreshToken);
    redirectUrl = "/admin/workplace";
  } catch (error) {
    console.log(error);
    redirectUrl = "/login";
  }

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
