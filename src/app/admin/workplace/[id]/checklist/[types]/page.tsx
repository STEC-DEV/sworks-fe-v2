"use client";
import ChecklistInfo, {
  KeyValue,
} from "@/app/admin/checklist/[id]/_components/checklist-info";

import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import ChkAccordion from "./_components/chk-accordion";
import IconButton from "@/components/common/icon-button";

const Page = () => {
  const { id, types } = useParams();
  const { checklistDetail, getChecklistDetail } = useWorkplaceDetailStore();
  const router = useRouter();

  useEffect(() => {
    if (!types) return;
    const [serviceTypeSeq, divCodeSeq, typeCodeSeq] = types
      ?.toString()
      .split("-");
    if (!id) return;

    getChecklistDetail(id.toString(), serviceTypeSeq, divCodeSeq, typeCodeSeq);
  }, []);
  return (
    <>
      <div className="w-125 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <AppTitle title="체크리스트" />
          <IconButton
            icon="SquarePen"
            size={16}
            onClick={() => router.push(`${types}/edit`)}
          />
        </div>

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
        {checklistDetail?.mains.map((v, i) => (
          <ChkAccordion key={i} data={v} />
        ))}
      </div>
    </>
  );
};

export default Page;
