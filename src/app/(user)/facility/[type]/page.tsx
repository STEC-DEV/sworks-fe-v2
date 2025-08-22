"use client";
import AppTitle from "@/components/common/label/title";
import { useFacilityMainStore } from "@/store/normal/facility/facility-main-store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  }, []);

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
  }, [searchParams]);
  return (
    <>
      <AppTitle title={decodeValue} />
      <FacilityFilter />
      <FacilityPagination />
      {facilityList.type === "data" ? (
        <DataTable
          columns={facilityColumns}
          data={facilityList.data}
          idName={"facilitySeq"}
          baseUrl={decodeValue.toLowerCase()}
          emptyMessage="M&O 데이터를 추가해주세요"
        />
      ) : (
        <BaseSkeleton className="h-full" />
      )}
    </>
  );
};

export default Page;
