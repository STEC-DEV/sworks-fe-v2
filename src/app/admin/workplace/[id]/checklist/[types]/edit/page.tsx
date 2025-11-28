"use client";
import { KeyValue } from "@/app/admin/checklist/[id]/_components/checklist-info";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import WorkplaceChecklistEditForm from "@/components/form/admin/workplace/checklist/edit";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";
import { useRouter } from "next/navigation";

import React from "react";

const Page = () => {
  const { checklistDetail } = useWorkplaceDetailChecklistStore();
  const router = useRouter();
  return (
    <div className="flex gap-2">
      {/* <div>
        <IconButton
          icon="ChevronLeft"
          size={24}
          onClick={() => router.back()}
        />
      </div> */}

      <div className="w-full xl:w-150 flex flex-col gap-4">
        <AppTitle title="체크리스트 수정" />

        {checklistDetail ? (
          <div className="flex flex-col gap-2">
            <KeyValue
              label={"업무 분야"}
              value={checklistDetail?.serviceTypeName}
            />
            <KeyValue
              label={"관리 부문"}
              value={checklistDetail?.divCodeName}
            />
            <KeyValue
              label={"관리 유형"}
              value={checklistDetail?.typeCodeName}
            />
          </div>
        ) : (
          <BaseSkeleton className="w-full h-50" />
        )}

        <WorkplaceChecklistEditForm />
      </div>
    </div>
  );
};

export default Page;
