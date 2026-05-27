"use client";
import { HeroBackground } from "@/app/page";
import CustomCard from "@/components/common/card";
import LoginForm from "@/components/form/login-form";
import Cookies from "js-cookie";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    // 모든 localStorage 삭제
    localStorage.clear();

    // sessionStorage도 삭제 (필요시)
    sessionStorage.clear();
    //쿠키삭제
    Cookies.remove("s-agent");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }, []);
  {
    /* <div className="flex items-center justify-center h-full bg-gradient-to-l from-blue-100 via-blue-300 to-blue-500"></div> */
  }
  return (
    <div className="flex items-center justify-center h-full relative">
      <HeroBackground />
      <Link href={"/"} className="z-10">
        <div className="absolute top-15 left-0 text-white text-lg font-medium bg-gray-300/40 px-12 py-2 hover:scale-110 duration-150">
          <ArrowLeft />
        </div>
      </Link>

      <div className="text-center w-full absolute top-10 md:top-40 left-1/2 -translate-x-1/2 flex flex-col gap-2">
        <span className="text-4xl font-extrabold text-white">
          Welcome S-Agent
        </span>
        <span className=" text-gray-100">에스텍시스템 용역업무관리 시스템</span>
      </div>
      <CustomCard className={`py-12 w-[95%] md:w-[60%] xl:w-130 `} size={"lg"}>
        {/* 헤드 */}
        <div className="flex flex-col gap-2 px-12 text-2xl font-medium text-primary">
          로그인
        </div>
        {/* 바디 */}
        <div className="px-12">
          <LoginForm />
        </div>
      </CustomCard>
    </div>
  );
};

export default page;
