"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import VocAddForm from "@/components/form/normal/voc/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { convertRecordDataToFormData } from "@/utils/convert";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const VocPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { vocList, postAddVoc, getVocList, loadingKeys } = useVocStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  const searchParams = useSearchParams();
  const handleSubmit = async (values: any) => {
    //결과처리 로직
    const formData = convertRecordDataToFormData(values);
    await postAddVoc(formData);
    setOpen(false);
    await getVocList(new URLSearchParams(searchParams));
  };

  if (isLoading(loadingKeys.LIST) || !vocList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;
  return (
    <CommonPagination totalCount={vocList.meta.totalCount}>
      {canWorkerEdit && (
        <BaseDialog
          triggerChildren={<IconButton icon={"Plus"} />}
          title="민원 접수"
          open={open}
          setOpen={setOpen}
        >
          <VocAddForm onSubmit={handleSubmit} />
        </BaseDialog>
      )}
    </CommonPagination>
  );
};

export default VocPagination;
