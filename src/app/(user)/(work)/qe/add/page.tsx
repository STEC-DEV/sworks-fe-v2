"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import QeAddForm from "@/components/form/normal/qe/add";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { useUIStore } from "@/store/common/ui-store";
import { useQeStore } from "@/store/normal/qe/qe-store";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const serviceTypeSeq = searchParams.get("serviceTypeSeq");
  const divCodeSeq = searchParams.get("divCodeSeq");
  const typeCodeSeq = searchParams.get("typeCodeSeq");
  const { evaluateChecklist, getEvaluateChecklist, loadingKeys } = useQeStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!searchParams) return;
    getEvaluateChecklist(searchParams);
  }, [searchParams]);

  useEffect(() => {
    console.log(evaluateChecklist);
  }, [evaluateChecklist]);

  if (isLoading(loadingKeys.EVALUATE_CHECKLIST) || !evaluateChecklist)
    return (
      <>
        <BaseSkeleton className="w-30 h-7" />
        <div className="flex flex-col gap-4 w-full xl:w-150">
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
        </div>
        <BaseSkeleton className="flex-1" />
      </>
    );
  if (hasError(loadingKeys.EVALUATE_CHECKLIST)) return <div> 에러발생</div>;

  return (
    <>
      <div className="flex flex-col gap-6 xl:w-150">
        <AppTitle title="품질평가" isBorder />
        <div className="flex flex-col gap-4 w-full xl:w-150">
          <KeyValueItem
            label={"업무유형"}
            value={evaluateChecklist.serviceTypeName}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle="flex-row justify-between"
          />
          <KeyValueItem
            label={"관리부문"}
            value={evaluateChecklist.divCodeName}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle="flex-row justify-between"
          />
          <KeyValueItem
            label={"관리유형"}
            value={evaluateChecklist?.typeCodeName}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle=" flex-row justify-between"
          />
        </div>
      </div>

      <QeAddForm />
    </>
  );
};

export default Page;
