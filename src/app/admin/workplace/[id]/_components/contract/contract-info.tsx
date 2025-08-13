"use client";
import CustomCard from "@/components/common/card";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import IconButton from "@/components/common/icon-button";

import { ScrollText } from "lucide-react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Contract } from "@/types/admin/workplace/contract-info";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { useParams, useRouter } from "next/navigation";
import BaseSkeleton from "@/components/common/base-skeleton";
import BaseDialog from "@/components/ui/custom/base-dialog";
import ContractEditForm from "@/components/form/admin/workplace/contract-edit";
import CheckDialog from "@/components/common/check-dialog";

const ContractWrapper = () => {
  const { contractList, getContractList } = useWorkplaceDetailStore();
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    getContractList(id.toString());
  }, []);
  return (
    <CustomAccordion
      icon={ScrollText}
      label="계약정보"
      optionChildren={
        <IconButton
          icon="Plus"
          className="z-100"
          onClick={() => router.push(`${id}/contract/add`)}
        />
      }
    >
      <div className="grid grid-cols-4 gap-6 px-4">
        {contractList
          ? contractList.map((c, i) => <ContractCard key={i} data={c} />)
          : Array.from({ length: 4 }, (_, i) => (
              <BaseSkeleton key={i} className="w-full h-50" />
            ))}
      </div>
    </CustomAccordion>
  );
};

const ContractCard = ({ data }: { data: Contract }) => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const handleDelete = () => {
    console.log(data);
  };
  return (
    <CustomCard className="w-full items-end gap-0 py-4 ">
      <div className="flex gap-2">
        <BaseDialog
          title="계약정보 수정"
          triggerChildren={<IconButton icon="SquarePen" size={16} />}
          open={editOpen}
          setOpen={setEditOpen}
        >
          <ContractEditForm data={data} setOpen={setEditOpen} />
        </BaseDialog>
        <CheckDialog
          title="삭제하시겠습니까?"
          description="해당 계약 정보를 삭제하면 사업장의 해당 계약 정보가 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
          actionLabel="삭제"
          onClick={handleDelete}
        >
          <IconButton icon="Trash2" size={16} />
        </CheckDialog>
      </div>
      <div className="flex flex-col gap-4 w-full px-4">
        <span className="text-sm text-blue-500">{data.contractTypeName}</span>
        <div className="flex flex-col gap-2 justify-center">
          <KeyValue label={"담당자"} value={data.contractManager ?? ""} />
          <KeyValue
            label={"계약인원"}
            value={data.contractStaff?.toString() ?? ""}
          />
          <KeyValue
            label={"계약일"}
            value={format(data.startDt, "yyyy-MM-dd")}
          />
          <KeyValue
            label={"해약일"}
            value={data.endDt ? format(data.endDt, "yyyy-MM-dd") : ""}
          />
          <KeyValue
            label={"계약금액"}
            value={data.contractAmount?.toString() ?? ""}
          />
        </div>
      </div>
    </CustomCard>
  );
};

interface KeyValueProps {
  label: string;
  value: string;
}

const KeyValue = ({ label, value }: KeyValueProps) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[var(--description-light)]">{label}</span>
      <span className="text-xs text-[var(--description-dark)] font-semibold">
        {value}
      </span>
    </div>
  );
};

export default ContractWrapper;
