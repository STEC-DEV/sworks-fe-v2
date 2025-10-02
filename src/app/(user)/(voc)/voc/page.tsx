"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";
import VocFilter from "./_components/filter";
import VocPagination from "./_components/pagination";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { useSearchParams } from "next/navigation";
import VocList from "./_components/list";

const Page = () => {
  const { getVocList } = useVocStore();
  const searchParams = useSearchParams();
  useEffect(() => {
    getVocList(new URLSearchParams(searchParams));
  }, []);

  useEffect(() => {
    getVocList(new URLSearchParams(searchParams));
  }, [searchParams]);
  return (
    <>
      <AppTitle title="민원" />
      <VocFilter />
      <VocPagination />
      <VocList />
    </>
  );
};

export default Page;
