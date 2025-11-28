"use client";
import { useFacilityDetailStore } from "@/store/normal/facility/facility-detail";

import React, { useEffect } from "react";
import FacInfo from "../../_components/fac-info";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";

const Page = () => {
  const { facilityDetail, getFacilityDetail, loadingKeys } =
    useFacilityDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { decodeValue: type } = useDecodeParam("type");
  const { rawValue: id } = useDecodeParam("id");

  useEffect(() => {
    if (id) {
      getFacilityDetail(id);
    }
  }, [id, getFacilityDetail]);

  if (isLoading(loadingKeys.INFO) || !facilityDetail)
    return <FacilityInfoSkeleton />;
  if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

  return (
    <div className="xl:w-150">
      {facilityDetail ? (
        <FacInfo data={facilityDetail} title={`${type} 상세`} />
      ) : (
        <BaseSkeleton />
      )}
    </div>
  );
};

export default Page;

const FacilityInfoSkeleton = () => {
  return (
    <div className="w-150">
      <BaseSkeleton className="h-8" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 7 }, (_, i) => (
          <div className="flex flex-col gap-1" key={i}>
            <BaseSkeleton className="h-4 w-15" />
            <BaseSkeleton className="h-5 " />
          </div>
        ))}
      </div>
      <BaseSkeleton className="h-8" />
      <div className="space-y-2">
        {Array.from({ length: 3 }, (_, i) => (
          <BaseSkeleton className="h-12.5 " key={i} />
        ))}
      </div>
    </div>
  );
};
