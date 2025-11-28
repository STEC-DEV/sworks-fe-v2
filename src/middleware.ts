import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
