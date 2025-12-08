"use client";
import AppTitle from "@/components/common/label/title";
import { useFacilityMainStore } from "@/store/normal/facility/facility-main-store";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { facilityColumns } from "../_components/rnm-columns";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useDecodeParam } from "@/hooks/params";
import FacilityFilter from "../_components/filter";
import FacilityPagination from "../_components/pagination";
import { mroColumns } from "../_components/mro-columns";
import BaseTable from "@/components/common/base-table";
import { useUIStore } from "@/store/common/ui-store";
import { CogIcon, HammerIcon, LucideIcon, Package } from "lucide-react";

const Page = () => {
  const { facilityList, getFacilityList, loadingKeys } = useFacilityMainStore();
  const { isLoading, hasError } = useUIStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const { decodeValue, rawValue } = useDecodeParam("type");

  useEffect(() => {
    if (!decodeValue) return;

    let facilitySeq = 0;
    switch (decodeValue) {
      case "R&M":
        facilitySeq = 1;
        break;
      case "M&O":
        facilitySeq = 2;
        break;
      case "MRO":
        facilitySeq = 3;
        break;
    }
    getFacilityList(new URLSearchParams(searchParams), facilitySeq.toString());
  }, [decodeValue, getFacilityList]);

  useEffect(() => {
    if (!decodeValue) return;
    let facilitySeq = 0;
    switch (decodeValue) {
      case "R&M":
        facilitySeq = 1;
        break;
      case "M&O":
        facilitySeq = 2;
        break;
      case "MRO":
        facilitySeq = 3;
        break;
    }

    getFacilityList(new URLSearchParams(searchParams), facilitySeq.toString());
  }, [searchParams, decodeValue, getFacilityList]);

  const getList = () => {
    if (isLoading(loadingKeys.LIST) || !facilityList) {
      return <BaseSkeleton className="flex-1" />;
    }
    if (hasError(loadingKeys.LIST)) {
      return <div>에러 발생</div>;
    }

    return (
      <BaseTable
        columns={decodeValue === "MRO" ? mroColumns : facilityColumns}
        data={facilityList.data}
        onRowClick={(data) =>
          router.push(`/facility/${rawValue}/${data.facilitySeq}`)
        }
      />
    );
  };

  const icon = (): LucideIcon => {
    switch (decodeValue) {
      case "R&M":
        return HammerIcon;
      case "M&O":
        return CogIcon;
      case "MRO":
        return Package;
      default:
        return HammerIcon;
    }
  };

  return (
    <>
      <AppTitle icon={icon()} title={decodeValue} />
      <FacilityFilter />
      <FacilityPagination />
      {getList()}
    </>
  );
};

export default Page;
