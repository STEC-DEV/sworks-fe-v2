"use client";
import { useDecodeParam } from "@/hooks/params";
import { useUserDailyTaskStore } from "@/store/normal/task/useUserDailyTask";
import React, { useEffect } from "react";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const { data, getData } = useUserDailyTaskStore();

  useEffect(() => {
    getData(rawValue);
  }, [rawValue]);

  return <div>{rawValue}</div>;
};

export default Page;
