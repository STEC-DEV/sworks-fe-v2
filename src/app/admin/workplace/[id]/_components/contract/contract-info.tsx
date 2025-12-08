"use client";
import CustomCard from "@/components/common/card";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import IconButton from "@/components/common/icon-button";

import { ScrollText } from "lucide-react";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Contract } from "@/types/admin/workplace/contract-info";
import { useParams, useRouter } from "next/navigation";
import BaseSkeleton from "@/components/common/base-skeleton";
import BaseDialog from "@/components/ui/custom/base-dialog";
import ContractEditForm from "@/components/form/admin/workplace/contract-edit";
import CheckDialog from "@/components/common/check-dialog";
import { usePermission } from "@/hooks/usePermission";
import { useWorkplaceDetailContractStore } from "@/store/admin/workplace/contract-store";
import { useUIStore } from "@/store/common/ui-store";
import { useDecodeParam } from "@/hooks/params";

const ContractWrapper = () => {
  const { canEdit } = usePermission();
  const { contractList, getContractList, loadingKeys } =
    useWorkplaceDetailContractStore();
  const { isLoading, hasError } = useUIStore();
  const router = useRouter();
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    getContractList(id.toString());
  }, []);

  const getList = () => {
    if (isLoading(loadingKeys.CONTRACT) || !contractList) {
      return Array.from({ length: 4 }, (_, i) => (
        <BaseSkeleton key={i} className="h-53" />
      ));
    }
    if (hasError(loadingKeys.CONTRACT)) return <div>에러 발생</div>;

    return contractList.map((c, i) => <ContractCard key={i} data={c} />);
  };

  return (
    <CustomAccordion
      icon={ScrollText}
      label="계약정보"
      optionChildren={
        canEdit && (
          <IconButton
            icon="Plus"
            className="z-100"
            onClick={() => router.push(`${id}/contract/add`)}
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

const ContractCard = ({ data }: { data: Contract }) => {
  const { canEdit } = usePermission();
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const { getContractList, deleteContract } = useWorkplaceDetailContractStore();
  const { rawValue: id } = useDecodeParam("id");
  const handleDelete = async () => {
    if (!id) return;
    await deleteContract(data.contractSeq);
    await getContractList(id);
  };
  return (
    <CustomCard className="w-full items-end gap-0 py-4 ">
      {canEdit && (
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
      )}

      <div className="flex flex-col gap-4 w-full px-4">
        <span className="text-sm text-blue-500">{data.contractTypeName}</span>
        <div className="flex flex-col gap-2 justify-center">
          <KeyValue
            label={"담당자"}
            value={data.contractManager || "내용없음"}
          />
          <KeyValue
            label={"계약인원"}
            value={data.contractStaff?.toString() || "내용없음"}
          />
          <KeyValue
            label={"계약일"}
            value={format(data.startDt, "yyyy-MM-dd")}
          />
          <KeyValue
            label={"해약일"}
            value={data.endDt ? format(data.endDt, "yyyy-MM-dd") : "내용없음"}
          />
          <KeyValue
            label={"계약금액"}
            value={`${data.contractAmount?.toString()} 원` || "내용없음"}
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
