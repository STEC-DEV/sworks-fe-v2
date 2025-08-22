"use client";
import { useFacilityDetailStore } from "@/store/normal/facility/facility-detail";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import FacInfo from "../../_components/fac-info";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useDecodeParam } from "@/hooks/params";

const Page = () => {
  const { facilityDetail, getFacilityDetail } = useFacilityDetailStore();
  const { decodeValue: type } = useDecodeParam("type");
  const { rawValue: id } = useDecodeParam("id");

  useEffect(() => {
    getFacilityDetail(id);
  }, []);

  return (
    <div className="w-150">
      {facilityDetail ? (
        <FacInfo data={facilityDetail} title={`${type} 상세`} />
      ) : (
        <BaseSkeleton />
      )}
    </div>
  );
};

export default Page;
