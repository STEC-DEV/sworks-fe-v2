"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import VocAddForm from "@/components/form/normal/voc/add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useVocStore } from "@/store/normal/voc/voc-store";
import React, { useState } from "react";

const VocPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { vocList } = useVocStore();
  const handleSubmit = async (values: any) => {
    //결과처리 로직
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
        <VocAddForm setOpen={setOpen} />
      </BaseDialog>
    </div>
  );
};

export default VocPagination;
