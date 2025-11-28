"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useDecodeParam } from "@/hooks/params";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { Building2 } from "lucide-react";
import React, { useEffect } from "react";
import { BuildingInfo, FacilityInfo, FireInfo } from "./_components/info-item";
import Image from "next/image";
import { useUIStore } from "@/store/common/ui-store";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const { building, getBuildingDetail, loadingKeys } = useBuildingDetailStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!rawValue) return;
    getBuildingDetail(rawValue);
  }, [rawValue]);

  if (isLoading(loadingKeys.DETAIL) || !building)
    return <BuildingDetailSkeleton />;
  if (hasError(loadingKeys.DETAIL)) return <div>에러 발생</div>;

  return (
    <>
      <AppTitle title={building?.dongName} />
      <div className="w-full h-60 border rounded-[4px] shrink-0 relative">
        {building.images ? (
          <Image
            fill
            className="w-full h-full object-cover"
            src={building?.images}
            alt="이미지"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background">
            <Building2
              size={24}
              className="text-[var(--icon)] "
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>
      <BuildingInfo />
      <FacilityInfo />
      <FireInfo />
    </>
  );
};

export default Page;

const BuildingDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 overflow-hidden">
      <BaseSkeleton className="h-7" />
      <BaseSkeleton className="h-60" />
      <BaseSkeleton className="h-75" />
      <BaseSkeleton className="h-75" />
      <BaseSkeleton className="h-75" />
    </div>
  );
};
