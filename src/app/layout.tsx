import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import BaseToast from "@/components/common/toast/base-toast";
import { geistMono } from "@/lib/fonts";
import ApiErrorHandler from "@/components/layout/error";
import RedirectError from "@/components/layout/redirect-error";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const suit = localFont({
  src: [
    {
      path: "../../public/font/SUIT-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-suit",
});

// font-family addition
const pretendard = localFont({
  src: "../../public/font/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "S-Agent",
  description: "에스텍시스템 용역업무관리 플랫폼",
  icons: {
    icon: "/S-Agent.png",
    apple: "/S-Agent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${suit.variable} ${geistMono.variable}`}>
      <body>
        <BaseToast />
        <ApiErrorHandler />
        {children}

        <RedirectError />
      </body>
    </html>
  );
}
