"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";
import ReqFilter from "./_components/filter";
import ReqPagination from "./_components/pagination";
import { useRequestTaskStore } from "@/store/normal/req/main";
import { useSearchParams } from "next/navigation";
import DataTable from "@/components/common/data-table";
import { reqCol } from "./_components/columns";
import BaseSkeleton from "@/components/common/base-skeleton";

const Page = () => {
  const { reqTaskList, getRequestTask } = useRequestTaskStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    getRequestTask(new URLSearchParams(searchParams));
  }, [searchParams]);
  return (
    <>
      <AppTitle title="업무요청" />
      <ReqFilter />
      <ReqPagination />
      {reqTaskList.type === "data" ? (
        <DataTable
          columns={reqCol}
          data={reqTaskList.payload.data}
          idName="requestSeq"
          baseUrl="req-task"
        />
      ) : (
        <BaseSkeleton />
      )}
    </>
  );
};

export default Page;
