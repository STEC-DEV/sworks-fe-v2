"use client";
import AppTitle from "@/components/common/label/title";
import React, { Suspense, useEffect, useState } from "react";
import TaskFilter from "./_components/filter";
import TaskPagination from "./_components/pagination";
import { useTaskStore } from "@/store/normal/task/task-store";
import { useSearchParams } from "next/navigation";
import TaskList from "./_components/list";
import { FileText } from "lucide-react";
import { toast } from "sonner";

const Page = () => {
  const { getTaskList, deleteTask } = useTaskStore();
  const searchParams = useSearchParams();
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([]);
  useEffect(() => {
    getTaskList(new URLSearchParams(searchParams));
  }, [searchParams, getTaskList]);

  const handleDelete = async () => {
    if (selectedTasks.length < 1) {
      return toast.error("삭제항목을 선택해주세요");
    }
    const seqList = selectedTasks.map((task) => task.taskSeq.toString());
    // 삭제 API 호출
    await deleteTask(seqList);
    // 성공 후 선택 초기화 & 리스트 새로고침
    setSelectedTasks([]);
    getTaskList(new URLSearchParams(searchParams));
  };

  return (
    <>
      <AppTitle title="업무" icon={FileText} />
      <TaskFilter />
      <TaskPagination onDelete={handleDelete} />
      <TaskList onSelectionChange={setSelectedTasks} />
    </>
  );
};

export default Page;
