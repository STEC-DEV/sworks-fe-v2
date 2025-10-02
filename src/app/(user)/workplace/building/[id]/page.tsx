"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useDecodeParam } from "@/hooks/params";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { Building2 } from "lucide-react";
import React, { useEffect } from "react";
import { BuildingInfo, FacilityInfo, FireInfo } from "./_components/info-item";
import IconButton from "@/components/common/icon-button";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const { building, getBuildingDetail } = useBuildingDetailStore();

  useEffect(() => {
    if (!rawValue) return;
    getBuildingDetail(rawValue);
  }, [rawValue]);

  useEffect(() => {
    console.log(building);
  }, [building]);

  return (
    <>
      {building ? (
        <AppTitle title={building?.dongName} />
      ) : (
        <BaseSkeleton className="h-7 flex-shrink-0" />
      )}

      {building ? (
        <div className="w-full h-60 border rounded-[4px] flex-shrink-0">
          {building.images ? (
            <img
              className="w-full h-full object-cover"
              src={building?.images}
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
      ) : (
        <BaseSkeleton className="h-60 flex-shrink-0" />
      )}
      <BuildingInfo />
      <FacilityInfo />
      <FireInfo />
    </>
  );
};

export default Page;
