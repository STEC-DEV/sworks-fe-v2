"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";
import { useUIStore } from "@/store/common/ui-store";

import { ListCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { dialogText } from "../../../../../../../public/text";

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
  const { getChecklist, deleteChecklist } = useWorkplaceDetailChecklistStore();
  const { id } = useParams();
  const { rawValue } = useDecodeParam("id");
  const router = useRouter();

  const onDelete = async () => {
    if (!rawValue) return;
    await deleteChecklist(
      parseInt(rawValue),
      data.serviceTypeSeq,
      data.divCodeSeq,
      data.typeCodeSeq,
    );
    await getChecklist(rawValue);
  };
  return (
    <CustomCard
      className="w-full  gap-2 py-4 hover:cursor-pointer hover:border-primary bg-background"
      onClick={() =>
        router.push(
          `/admin/workplace/${id}/checklist/${data.serviceTypeSeq}-${data.divCodeSeq}-${data.typeCodeSeq}`,
        )
      }
    >
      {canEdit && (
        <div
          className="flex justify-end px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <CheckDialog
            title={dialogText.defaultDelete.title}
            description={dialogText.defaultDelete.description}
            actionLabel={dialogText.defaultDelete.actionLabel}
            onClick={onDelete}
          >
            <IconButton
              icon="Trash2"
              size={16}
              bgClassName="w-8 h-8 p-1 !rounded-DEFAULT border border-border-strong shadow-sm hover:bg-red-50 hover:border-destructive"
              className="group-hover:text-destructive"
            />
          </CheckDialog>
        </div>
      )}

      <div className="flex justify-between items-center px-4">
        <span className="text-primary font-semibold">
          {data.serviceTypeName}
        </span>
        <span className="text-description-strong">
          {data.divCodeName}({data.typeCodeName})
        </span>
      </div>
    </CustomCard>
  );
};

export default ChecklistWrapper;
