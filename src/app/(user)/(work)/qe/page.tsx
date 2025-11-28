"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";

import QePagination from "./_components/pagination";
import { useQeStore } from "@/store/normal/qe/qe-store";
import { useSearchParams } from "next/navigation";
import QeFilter from "./_components/filter";
import QeList from "./_components/list";
import { BadgeCheck } from "lucide-react";

const Page = () => {
  const { getQeList } = useQeStore();

  const searchParams = useSearchParams();

  useEffect(() => {
    getQeList(new URLSearchParams(searchParams));
  }, [searchParams]);
  return (
    <>
      <AppTitle title="품질평가" icon={BadgeCheck} />
      <QeFilter />
      <QePagination />
      <QeList />
    </>
  );
};

export default Page;
