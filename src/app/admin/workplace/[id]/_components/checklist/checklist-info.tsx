"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { ListCheck } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ChecklistWrapper = () => {
  const router = useRouter();
  const { id } = useParams();
  const { checklist, getChecklist } = useWorkplaceDetailStore();
  useEffect(() => {
    if (!id) return;
    getChecklist(id.toString());
  }, []);
  return (
    <CustomAccordion
      icon={ListCheck}
      label="체크리스트"
      optionChildren={
        <IconButton
          icon="Plus"
          onClick={() => router.push(`${id}/checklist/add`)}
        />
      }
    >
      <div className="grid grid-cols-4 gap-6 px-4">
        {checklist
          ? checklist.map((c, i) => <ChecklistCard key={i} data={c} />)
          : Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-22" />
            ))}
      </div>
    </CustomAccordion>
  );
};

const ChecklistCard = ({ data }: { data: WorkplaceChecklist }) => {
  const { id } = useParams();
  return (
    <Link
      href={`${id}/checklist/${data.serviceTypeSeq}-${data.divCodeSeq}-${data.typeCodeSeq}`}
    >
      <CustomCard className="w-full  gap-0 py-4 hover:cursor-pointer hover:border-blue-500">
        <div className="flex justify-end px-4">
          <IconButton icon="Trash2" size={16} />
        </div>
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
