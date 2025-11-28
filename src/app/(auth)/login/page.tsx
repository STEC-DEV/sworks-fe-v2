import CustomCard from "@/components/common/card";
import LoginForm from "@/components/form/login-form";

import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-l from-blue-100 via-blue-300 to-blue-500">
      <CustomCard className={`w-130`} size={"lg"}>
        {/* 헤드 */}
        <div className="flex flex-col gap-2 px-16">
          <span className="text-2xl font-extrabold">Welcome S-Agent</span>
          <span className="text-sm text-[var(--description-light)]">
            에스텍시스템 용역업무관리 플랫폼
          </span>
        </div>
        {/* 바디 */}
        <div className="px-16">
          <LoginForm />
        </div>
      </CustomCard>
    </div>
  );
};

export default page;
