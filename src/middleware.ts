import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import chalk from "chalk";
import { JWTVerified } from "./lib/jwt-verifiied";
import { getTime } from "./lib/time";

export const c = {
  // Reset
  r: "\x1b[0m",

  // 전경색 (텍스트 색상)
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  brightWhite: "\x1b[97m",

  // 배경색
  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",

  // 밝은 배경색
  bgBrightBlack: "\x1b[100m",
  bgBrightRed: "\x1b[101m",
  bgBrightGreen: "\x1b[102m",
  bgBrightYellow: "\x1b[103m",
  bgBrightBlue: "\x1b[104m",
  bgBrightMagenta: "\x1b[105m",
  bgBrightCyan: "\x1b[106m",
  bgBrightWhite: "\x1b[107m",

  // 스타일
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  underline: "\x1b[4m",
};

export interface JWTPayload {
  UserSeq: number;
  Name: string;
  jti: string;
  UserType: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
  mode: boolean;
  uuid: string;
  exp: number;
  iss: string;
  aud: string;
}

const workerBenUrl = [
  "/admin",
  "/task",
  "/daily",
  "/qe",
  "/r&m",
  "/m&o",
  "/mro",
  "/equipment",
  "/voc",
  "/qr",
];

const guestBenUrl = [
  "/admin",
  "/workplace",
  "/task",
  "/daily",
  "/qe",
  "/voc",
  "/qr",
];

const siteManagerBenUrl = ["/admin"];

const ROLE_RESTRICTION = {
  User: { restrictedUrls: workerBenUrl, canAdd: false },
  Guest: { restrictedUrls: guestBenUrl, canAdd: false },
  SiteManager: { restrictedUrls: siteManagerBenUrl, canAdd: true },
  Manager: { restrictedUrls: [], canAdd: true },
  Master: { restrictedUrls: [], canAdd: true },
  SystemManager: { restrictedUrls: [], canAdd: true },
} as const;

const setUnauthorizedCookie = (res: NextResponse) => {
  res.cookies.set("redirect_error", "unauthorized", {
    maxAge: 3,
    path: "/",
    httpOnly: false,
  });
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. 정적 파일 및 API 요청 스킵
  const isFileRequest = pathname.match(/\.\w+$/);
  if (isFileRequest) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  //2. 인증없이 접근 가능한 경로
  const publicPath = ["/login", "/complain", "/cancel"];
  if (publicPath.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname == "/login") return NextResponse.next();
  if (pathname.startsWith("/complain")) return NextResponse.next();

  //3. 토큰 확인
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // refreshToken이 없으면 로그인 필요
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // accessToken이 없으면 로그인 필요 (또는 refresh 로직)
  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. JWT 검증 및 권한 체크
  try {
    const payload = await JWTVerified(accessToken);

    const role =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const userSeq = payload.UserSeq;
    console.log(
      `${c.cyan}[${getTime()}]${c.r} ${c.bgBlue}${c.brightWhite}${
        c.bold
      } 📍 REQUEST ${c.r} ${pathname}`
    );
    console.log(
      `${c.cyan}[${getTime()}]${c.r} ${c.bgGreen}${c.black}${c.bold} 👤 User ${
        payload.UserSeq
      } ${c.r} ${role}`
    );

    const loginMode =
      payload.mode.toString() === "True" || payload.mode === true;
    const isAdminPath = pathname.startsWith("/admin");

    console.log("━━━━━━━━━━━━━━━━━━━━━━");
    console.log("JWT mode:", payload.mode);
    console.log("loginMode (boolean):", loginMode);
    console.log("pathname:", pathname);
    console.log("isAdminPath:", isAdminPath);
    console.log("━━━━━━━━━━━━━━━━━━━━━━");

    // 관리모드 <-> 사업장모드 접근 제어
    if (loginMode && !isAdminPath) {
      //관리모드가 사업장에 접근
      const res = NextResponse.redirect(new URL("/admin/workplace", req.url));
      setUnauthorizedCookie(res);
      return res;
    }

    if (!loginMode && isAdminPath) {
      //사업장모드에서 관리모드
      const res = NextResponse.redirect(new URL("/schedule", req.url));
      setUnauthorizedCookie(res);
      return res;
    }

    //5. 권한별 제한 체크
    const config = ROLE_RESTRICTION[role as keyof typeof ROLE_RESTRICTION];

    if (config) {
      const isRestrictedBaseUrl = config.restrictedUrls.some((url) =>
        pathname.startsWith(url)
      );
      const isRestrictedAction =
        !config.canAdd &&
        (pathname.includes("/add") || pathname.includes("/edit"));

      if (isRestrictedAction || isRestrictedBaseUrl) {
        console.log(
          `${c.cyan}[${getTime()}]${c.r}${c.bgRed}${
            c.bold
          } 🚫 ACCESS BLOCKED [${pathname}] User ${userSeq} ${role} ${c.r}`
        );

        const response = NextResponse.redirect(new URL("/schedule", req.url));
        response.cookies.set("redirect_error", "unauthorized", {
          maxAge: 3,
          path: "/",
          httpOnly: false,
        });

        return response;
      }
    }

    // ✅ 검증 성공 - 정상 진행
    return NextResponse.next();
  } catch (err: any) {
    console.error("JWT 검증 에러:", err);

    // ✅ 토큰 만료 시 - refreshToken이 있으면 클라이언트에서 처리하도록 통과
    if (err.code === "ERR_JWT_EXPIRED" && refreshToken) {
      console.log(
        `${c.cyan}[${getTime()}]${c.r}${
          c.yellow
        } ⚠️ 토큰 만료 - 클라이언트에서 갱신 예정${c.r}`
      );
      // 클라이언트의 retry 로직이 작동하도록 일단 통과
      return NextResponse.next();
    }

    // ✅ refreshToken도 없거나 기타 에러 - 로그인으로
    console.log(
      `${c.cyan}[${getTime()}]${c.r}${c.red} ❌ 인증 실패 - 로그인 필요${c.r}`
    );
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * API 라우트와 정적 파일들을 제외한 모든 경로에 적용
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
