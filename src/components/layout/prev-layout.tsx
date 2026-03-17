"use client";

import React from "react";
import IconButton from "../common/icon-button";
import { useRouter } from "next/navigation";

const PrevLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <>
      {/* xl 미만: children만 표시 */}
      <div className="xl:hidden">{children}</div>

      {/* xl 이상: 전체 레이아웃 표시 */}
      <div className="hidden xl:flex flex-row gap-4 flex-1">
        <IconButton
          icon="ChevronLeft"
          bgClassName="border border-border-strong !rounded-DEFAULT shadow-sm"
          size={28}
          onClick={() => router.back()}
        />
        {children}
      </div>
    </>
  );
};

export default PrevLayout;
