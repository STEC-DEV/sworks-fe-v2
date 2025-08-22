"use client";
import { logout } from "@/app/server-action/auth/auth-action";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import LoadingOverlay from "@/components/ui/custom/overlay/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/auth/auth-store";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

const Page = () => {
  const { adminWorkplaceList, getAdminWorkplaceList, getWorkplacePermission } =
    useAuthStore();
  const [enter, setEnter] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    getAdminWorkplaceList();
  }, []);

  const handleEnter = (workplace: AdminWorkplaceSelectListItem) => {
    setEnter(true);
    // getWorkplacePermission(workplace.siteSeq.toString());
    router.replace("/facility/r&m");
  };
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-l from-blue-100 via-blue-300 to-blue-500">
      <CustomCard className={`w-130`} size={"lg"}>
        {/* 헤드 */}
        <div className="flex flex-col gap-2 px-16">
          <span className="text-2xl font-extrabold">사업장 선택</span>
          <span className="text-sm text-[var(--description-light)]">
            관리할 사업장을 선택해주세요
          </span>
        </div>
        <ScrollArea className="px-16 h-100">
          <div className="flex flex-col gap-3">
            {adminWorkplaceList ? (
              adminWorkplaceList.map((v, i) => (
                <WorkplaceBox key={i} data={v} onClick={handleEnter} />
              ))
            ) : (
              <BaseSkeleton className="w-full h-100" />
            )}
          </div>
        </ScrollArea>

        <div className="px-16">
          <Button label="취소" onClick={() => logout()} disabled={enter} />
        </div>
      </CustomCard>
      <LoadingOverlay isVisible={enter} message="Loading..." />
    </div>
  );
};

const WorkplaceBox = ({
  data,
  onClick,
}: {
  data: AdminWorkplaceSelectListItem;
  onClick: (data: AdminWorkplaceSelectListItem) => void;
}) => {
  return (
    <CustomCard
      variant={"list"}
      className="gap-1 px-3 py-3 hover:border-blue-500 hover:bg-blue-50"
      onClick={() => onClick(data)}
    >
      <span className="text-sm">{data.siteName}</span>
      <span className="text-xs text-[var(--description-light)]">
        {data.siteAddress}
      </span>
    </CustomCard>
  );
};

export default Page;
