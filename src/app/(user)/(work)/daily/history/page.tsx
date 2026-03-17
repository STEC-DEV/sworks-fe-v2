"use client";
import AppTitle from "@/components/common/label/title";
import { useTaskHistoryStore } from "@/store/normal/task/task-history-store";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import TaskHistoryFilter from "./_components/filter";
import TaskHistoryPagination from "./_components/pagination";
import TaskHistoryList from "./_components/list";
import { FileClock } from "lucide-react";
import { OptionSectionWrapper } from "@/components/common/option-wrapper";

const Page = () => {
  const { getTaskHistoryList } = useTaskHistoryStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    getTaskHistoryList(new URLSearchParams(searchParams));
  }, [searchParams, getTaskHistoryList]);

  return (
    <>
      <AppTitle title="일일업무 이력" isPrev prevPath="/daily" />
      <OptionSectionWrapper>
        <TaskHistoryFilter />
        <TaskHistoryPagination />
      </OptionSectionWrapper>

      <TaskHistoryList />
    </>
  );
};

export default Page;
