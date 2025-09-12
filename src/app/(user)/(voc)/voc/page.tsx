"use client";
import AppTitle from "@/components/common/label/title";
import React, { useEffect } from "react";
import VocFilter from "./_components/filter";
import VocPagination from "./_components/pagination";
import DataTable from "@/components/common/data-table";
import { vocListCol } from "./_components/voc-columns";
import { useVocStore } from "@/store/normal/voc/voc-store";
import BaseSkeleton from "@/components/common/base-skeleton";
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
