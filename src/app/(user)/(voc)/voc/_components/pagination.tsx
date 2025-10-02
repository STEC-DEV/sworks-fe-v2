"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import VocAddForm from "@/components/form/normal/voc/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useVocStore } from "@/store/normal/voc/voc-store";
import { convertRecordDataToFormData } from "@/utils/convert";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const VocPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { vocList, postAddVoc, getVocList } = useVocStore();
  const searchParams = useSearchParams();
  const handleSubmit = async (values: any) => {
    console.log(values);
    //결과처리 로직
    const formData = convertRecordDataToFormData(values);
    const res = await postAddVoc(formData);
    res.data ? toast.success("등록") : toast.error("실패");
    await getVocList(new URLSearchParams(searchParams));
    setOpen(false);
  };

  if (vocList.type === "loading") return <BaseSkeleton className="h-10" />;
  if (vocList.type === "error") return;
  return (
    <div className="flex gap-4 items-center">
      <CommonPagination totalCount={vocList.payload.meta.totalCount} />
      <BaseDialog
        triggerChildren={<IconButton icon={"Plus"} />}
        title="민원 접수"
        open={open}
        setOpen={setOpen}
      >
        <VocAddForm onSubmit={handleSubmit} />
      </BaseDialog>
    </div>
  );
};

export default VocPagination;
