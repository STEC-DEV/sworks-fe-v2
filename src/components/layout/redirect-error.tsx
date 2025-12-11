"use client";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { toast } from "sonner";

function RedirectErrorContent() {
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      console.log(value);
      console.log(parts);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const error = getCookie("redirect_error");

    if (error === "unauthorized") {
      toast.error("잘못된 접근입니다.");

      // 쿠키 즉시 삭제 (중복 방지)
      document.cookie = "redirect_error=; Max-Age=0; path=/";
    }
  }, []);

  return null;
}

const RedirectError = () => {
  return (
    <Suspense fallback={null}>
      <RedirectErrorContent />
    </Suspense>
  );
};

export default RedirectError;
