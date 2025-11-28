"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { usePermission } from "@/hooks/usePermission";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";
import { useUIStore } from "@/store/common/ui-store";

import { ListCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChecklistWrapper = () => {
  const { canEdit } = usePermission();
  const router = useRouter();
  const { id } = useParams();
  const { checklist, getChecklist, loadingKeys } =
    useWorkplaceDetailChecklistStore();
  const { isLoading, hasError } = useUIStore();
  useEffect(() => {
    if (!id) return;
    getChecklist(id.toString());
  }, []);

  const getList = () => {
    if (isLoading(loadingKeys.CHECKLIST) || !checklist)
      return Array.from({ length: 4 }, (_, i) => (
        <BaseSkeleton className="h-21" key={i} />
      ));
    if (hasError(loadingKeys.CHECKLIST)) return <div>에러 발생</div>;
    return checklist.map((c, i) => <ChecklistCard key={i} data={c} />);
  };
  return (
    <CustomAccordion
      icon={ListCheck}
      label="체크리스트"
      optionChildren={
        canEdit && (
          <IconButton
            icon="Plus"
            onClick={() => router.push(`${id}/checklist/add`)}
          />
        )
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6">
        {getList()}
      </div>
    </CustomAccordion>
  );
};

const ChecklistCard = ({ data }: { data: WorkplaceChecklist }) => {
  const { canEdit } = usePermission();
  const { id } = useParams();
  return (
    <Link
      href={`${id}/checklist/${data.serviceTypeSeq}-${data.divCodeSeq}-${data.typeCodeSeq}`}
    >
      <CustomCard className="w-full  gap-0 py-4 hover:cursor-pointer hover:border-blue-500">
        {canEdit && (
          <div className="flex justify-end px-4">
            <IconButton icon="Trash2" size={16} />
          </div>
        )}

        <div className="flex justify-between items-center px-4">
          <span className="text-blue-500">{data.serviceTypeName}</span>
          <span>
            {data.divCodeName}({data.typeCodeName})
          </span>
        </div>
      </CustomCard>
    </Link>
  );
};

export default ChecklistWrapper;
