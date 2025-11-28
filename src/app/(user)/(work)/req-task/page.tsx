"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";
import ReqFilter from "./_components/filter";
import ReqPagination from "./_components/pagination";
import { useRequestTaskStore } from "@/store/normal/req/main";
import { useRouter, useSearchParams } from "next/navigation";
import { reqCol } from "./_components/columns";
import BaseSkeleton from "@/components/common/base-skeleton";
import BaseTable from "@/components/common/base-table";
import { useUIStore } from "@/store/common/ui-store";
import { MessageSquareReply } from "lucide-react";

const Page = () => {
  const { reqTaskList, getRequestTask, loadingKeys } = useRequestTaskStore();
  const { isLoading, hasError } = useUIStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    getRequestTask(new URLSearchParams(searchParams));
  }, [searchParams, getRequestTask]);

  const getList = () => {
    if (isLoading(loadingKeys.LIST) || !reqTaskList)
      return <BaseSkeleton className="flex-1" />;
    if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

    return (
      <BaseTable
        columns={reqCol}
        data={reqTaskList.data}
        onRowClick={(data) => router.push(`/req-task/${data.requestSeq}`)}
      />
    );
  };
  return (
    <>
      <AppTitle title="업무요청" icon={MessageSquareReply} />
      <ReqFilter />
      <ReqPagination />
      {getList()}
    </>
  );
};

export default Page;
