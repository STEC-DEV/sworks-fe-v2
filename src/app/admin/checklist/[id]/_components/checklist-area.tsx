"use client";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import React from "react";
import ChkAccordion from "./chk-accordion";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useParams, useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import BaseSkeleton from "@/components/common/base-skeleton";
import EmptyBox from "@/components/ui/custom/empty";

const ChecklistArea = () => {
  const { checklistDetail, loadingKeys } = useChecklistDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { canEdit } = usePermission();
  const { id } = useParams();
  const router = useRouter();

  const getList = () => {
    if (isLoading(loadingKeys.INFO) || !checklistDetail)
      return Array.from({ length: 5 }, (_, i) => (
        <BaseSkeleton className="h-12" key={i} />
      ));
    if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;

    return checklistDetail.mains.length > 0 ? (
      checklistDetail.mains.map((v, i) => <ChkAccordion key={i} data={v} />)
    ) : (
      <EmptyBox />
    );
  };

  return (
    <>
      <div className="flex justify-between items-center w-full xl:w-150">
        <AppTitle title="평가항목" />
        {canEdit && (
          <IconButton
            icon="Plus"
            size={16}
            onClick={() => router.push(`${id}/add`)}
          />
        )}
      </div>
      <div className="w-full xl:w-150 flex flex-col gap-4">{getList()}</div>
    </>
  );
};

export default ChecklistArea;
