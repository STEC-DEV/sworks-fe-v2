"use client";
import { subscribeToApiErrors } from "@/lib/api/errorHandler";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Dialog } from "../ui/dialog";
import BaseOverlay from "../common/overlay";
import CustomCard from "../common/card";
import AppTitle from "../common/label/title";
import Button from "../common/button";

const ApiErrorHandler = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToApiErrors((error) => {
      if (error.status === 409) {
        setIsOpen(true); // state 업데이트로 렌더링 트리거
      }
    });
    return unsubscribe;
  }, []);

  // 컴포넌트의 return에서 렌더링
  if (!isOpen) return null;

  return (
    <BaseOverlay isOpen={isOpen} onBackClick={() => {}}>
      <CustomCard className="px-6">
        <AppTitle title="세션만료" />
        <span>로그인 세션이 만료되었습니다. 다시 로그인해주세요.</span>
        <Button
          label="확인"
          onClick={() => {
            setIsOpen(false);
            router.push("/login");
          }}
        />
      </CustomCard>
    </BaseOverlay>
  );
};
export default ApiErrorHandler;
