import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import BaseToast from "@/components/common/toast/base-toast";
import { geistMono } from "@/lib/fonts";
import ApiErrorHandler from "@/components/layout/error";
import RedirectError from "@/components/layout/redirect-error";

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
    icon: "/s-agent-badge-green.svg",
    apple: "/s-agent-badge-green.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pretendard.variable} ${geistMono.variable}`}>
      <body>
        <BaseToast />
        <ApiErrorHandler />
        {children}

        <RedirectError />
      </body>
    </html>
  );
}
