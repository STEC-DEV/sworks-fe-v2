"use client";
import AppTitle from "@/components/common/label/title";
import React, { Suspense, useCallback } from "react";
import ComplainAddForm from "./_components/add";
import BaseSkeleton from "@/components/common/base-skeleton";
import { useSearchParams } from "next/navigation";

const ComplainAddContent = () => {
  const searchParams = useSearchParams();

  const seq = searchParams.get("vocSeq");
  if (!seq) return <BaseSkeleton />;
  return <ComplainAddForm seq={parseInt(seq)} />;
};

const Page = () => {
  return (
    <div className="flex justify-center h-screen overflow-hidden">
      <div className="flex flex-col gap-6 w-full xl:max-w-[769px] xl:border py-6 h-full bg-white shadow-xl ">
        <div className="px-6 shrink-0">
          <AppTitle title="민원접수" />
        </div>

        <Suspense fallback={<BaseSkeleton />}>
          <ComplainAddContent />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
