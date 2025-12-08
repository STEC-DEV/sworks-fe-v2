import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  UserSeq: "117";
  Name: "난매니저";
  jti: "5aa1b828-4ef5-45c7-887f-89fa81c0350a";
  UserType: "매니저";
  // http://schemas.microsoft.com/ws/2008/06/identity/claims/role: "Manager",
  uuid: "c3f40bdea1fa49dd9aa828c278aed820";
  exp: 1764728469;
  iss: "https://sws.s-tec.co.kr/";
  aud: "https://sws.s-tec.co.kr/";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // const token = req.cookies.get("accessToken")?.value;

  // // console.log("토큰");
  // // console.log(token);
  // if (!token) return;

  // try {
  //   console.log("여기옴");
  //   const decoded = jwt.verify(token, token) as JWTPayload;
  //   console.log("gma");
  //   console.log("JWT 검증 성공:", decoded);
  //   console.log("사용자 역할:", decoded.UserType);
  // } catch (err) {
  //   console.log(err);
  // }

  // 경로에 확장자가 있으면 `true` 없으면 `null`
  const isFileRequest = pathname.match(/\.\w+$/);

  // 경로에 확장자가 있다면 미들웨어 로직 스킵
  if (isFileRequest) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    console.log("API 요청 - 미들웨어 스킵");
    return NextResponse.next();
  }

  // 로그인 페이지는 검사 대상에서 제외
  if (pathname == "/login") return NextResponse.next();
  if (pathname.startsWith("/complain")) return NextResponse.next();
  if (pathname.startsWith("/facility")) return NextResponse.next();
  if (pathname.startsWith("/equipment")) return NextResponse.next();

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // console.log("리프레시 토큰 ", refreshToken);

  // /**
  //  * 관리자 페이지 경우 조건부 로직
  //  */

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", req.url));
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
