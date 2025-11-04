"use client";
import DailyTaskAddForm from "@/components/form/normal/task/add";
import ChecklistAddForm from "@/components/form/normal/task/add2";
import TaskInfoAddForm from "@/components/form/normal/task/add3";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useAuthStore } from "@/store/auth/auth-store";
import { useTaskStore } from "@/store/normal/task/task-store";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const { workplaceId, getWorkplacePermission } = useAuthStore();
  const { updateCreateTask, resetCreateTask, postAddTask } = useTaskStore();

  useEffect(() => {
    if (!workplaceId) return;
    getWorkplacePermission(workplaceId?.toString());
  }, []);

  useEffect(() => {
    return () => {
      resetCreateTask();
    };
  }, []);

  const handleNext = (values: Record<string, any>) => {
    setCurStep((prev) => prev + 1);
    updateCreateTask(values);
  };

  const handlePrev = () => {
    setCurStep((prev) => prev - 1);
  };

  const handleSubmit = async (values: Record<string, any>) => {
    await handleNext(values);
    const res = await postAddTask();
    setFormResult(res);
    setOpen(true);
  };

  const formConfigs = {
    titles: ["유형정보", "평가항목", "업무내용"],
    forms: [
      <DailyTaskAddForm onNext={handleNext} />,
      <ChecklistAddForm onNext={handleNext} onPrev={handlePrev} />,
      <TaskInfoAddForm onNext={handleSubmit} onPrev={handlePrev} />,
    ],
  };

  return (
    <>
      <FormLayout
        steps={formConfigs}
        title="업무 생성"
        description="업무정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={`/daily/task`}
        failedUrl={`/daily/task`}
      />
    </>
  );
};

export default Page;
