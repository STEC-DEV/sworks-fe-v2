"use client";
import { KeyValue } from "@/app/admin/checklist/[id]/_components/checklist-info";

import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ChkAccordion from "./_components/chk-accordion";
import IconButton from "@/components/common/icon-button";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";
import { useUIStore } from "@/store/common/ui-store";
import EmptyBox from "@/components/ui/custom/empty";

const Page = () => {
  const { id, types } = useParams();
  const { checklistDetail, getChecklistDetail, loadingKeys } =
    useWorkplaceDetailChecklistStore();
  const { isLoading, hasError } = useUIStore();
  const router = useRouter();

  const loading = isLoading(loadingKeys.DETAIL);

  useEffect(() => {
    if (!types || !id) return;

    const [serviceTypeSeq, divCodeSeq, typeCodeSeq] = types
      .toString()
      .split("-");
    getChecklistDetail(id.toString(), serviceTypeSeq, divCodeSeq, typeCodeSeq);
  }, [id, types, getChecklistDetail]);

  if (loading || !checklistDetail) {
    return <ChecklistSkeleton />;
  }

  if (hasError(loadingKeys.DETAIL)) {
    return <div>에러가 발생하였습니다.</div>;
  }

  return (
    <div className="w-full xl:w-150 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <AppTitle title="체크리스트" />
        <IconButton
          icon="SquarePen"
          size={16}
          onClick={() => router.push(`${types}/edit`)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <KeyValue
          label={"업무 분야"}
          value={checklistDetail?.serviceTypeName}
        />
        <KeyValue label={"관리 부문"} value={checklistDetail?.divCodeName} />
        <KeyValue label={"관리 유형"} value={checklistDetail?.typeCodeName} />
      </div>
      {checklistDetail?.mains.length > 0 ? (
        checklistDetail?.mains.map((v, i) => <ChkAccordion key={i} data={v} />)
      ) : (
        <EmptyBox />
      )}
    </div>
  );
};

export default Page;

const ChecklistSkeleton = () => {
  return (
    <div className="w-full xl:w-150 flex flex-col gap-4">
      <BaseSkeleton className="h-8" />
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex justify-between items-center">
            <BaseSkeleton className="w-12 h-5" />
            <BaseSkeleton className="w-12 h-5" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }, (_, i) => (
          <BaseSkeleton key={i} className="h-13" />
        ))}
      </div>
    </div>
  );
};
