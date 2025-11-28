"use client";
import AppTitle from "@/components/common/label/title";
import React, { Suspense, useEffect } from "react";
import VocFilter from "./_components/filter";
import VocPagination from "./_components/pagination";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { useSearchParams } from "next/navigation";
import VocList from "./_components/list";
import { Headset } from "lucide-react";

const Page = () => {
  const { getVocList } = useVocStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    getVocList(new URLSearchParams(searchParams));
  }, [searchParams, getVocList]);
  return (
    <>
      <AppTitle title="민원" icon={Headset} />
      <VocFilter />
      <VocPagination />
      <VocList />
    </>
  );
};

export default Page;
