"use client";
import AppTitle from "@/components/common/label/title";
import React, { Suspense, useEffect } from "react";
import TaskFilter from "./_components/filter";
import TaskPagination from "./_components/pagination";
import { useTaskStore } from "@/store/normal/task/task-store";
import { useSearchParams } from "next/navigation";
import TaskList from "./_components/list";
import { FileText } from "lucide-react";

const Page = () => {
  const { getTaskList } = useTaskStore();
  const searchParams = useSearchParams();
  useEffect(() => {
    getTaskList(new URLSearchParams(searchParams));
  }, [searchParams, getTaskList]);
  return (
    <>
      <AppTitle title="업무" icon={FileText} />
      <TaskFilter />
      <TaskPagination />
      <TaskList />
    </>
  );
};

export default Page;
