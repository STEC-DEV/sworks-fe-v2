"use client";
import AppTitle from "@/components/common/label/title";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-sotre";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import TaskHistoryFilter from "./_components/filter";
import TaskHistoryPagination from "./_components/pagination";
import TaskHistoryList from "./_components/list";

const Page = () => {
  const { getTaskHistoryList } = useTaskHistoryStore();
  const searchParams = useSearchParams();

  // console.log("🔵 Page 렌더링, searchParams:", searchParams.toString());

  useEffect(() => {
    // console.log("🟢 useEffect 실행, params:", searchParams.toString());
    getTaskHistoryList(new URLSearchParams(searchParams));
  }, [searchParams.toString()]);

  return (
    <>
      <AppTitle title="일일업무 이력" />
      <TaskHistoryFilter />
      <TaskHistoryPagination />
      <TaskHistoryList />
    </>
  );
};

export default Page;
