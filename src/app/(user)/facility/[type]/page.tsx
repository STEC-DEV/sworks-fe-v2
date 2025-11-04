"use client";
import AppTitle from "@/components/common/label/title";
import { useFacilityMainStore } from "@/store/normal/facility/facility-main-store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import DataTable from "@/components/common/data-table";
import { facilityColumns } from "../_components/rnm-columns";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useDecodeParam } from "@/hooks/params";
import FacilityFilter from "../_components/filter";
import FacilityPagination from "../_components/pagination";

const Page = () => {
  const { facilityList, getFacilityList } = useFacilityMainStore();
  const searchParams = useSearchParams();

  const { decodeValue } = useDecodeParam("type");

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
  }, [decodeValue]);

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
  }, [searchParams, decodeValue]);

  const getList = () => {
    if (facilityList.type === "loading") {
      return <BaseSkeleton />;
    }
    if (facilityList.type === "error") {
      return <BaseSkeleton />;
    }
    return (
      <DataTable
        columns={facilityColumns}
        data={facilityList.payload.data}
        idName={"facilitySeq"}
        baseUrl={decodeValue.toLowerCase()}
        emptyMessage={`${decodeValue} 데이터를 추가해주세요`}
      />
    );
  };

  return (
    <>
      <AppTitle title={decodeValue} />
      <FacilityFilter />
      <FacilityPagination />
      {getList()}
    </>
  );
};

export default Page;
