"use client";

import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUIStore } from "@/store/common/ui-store";
import { useQeStore } from "@/store/normal/qe/qe-store";
import { EvaluateListItem } from "@/types/normal/qe/qe";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const QePagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { qeList, loadingKeys } = useQeStore();
  const { isLoading, hasError } = useUIStore();

  if (isLoading(loadingKeys.LIST) || !qeList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러 발생</div>;

  return (
    <CommonPagination totalCount={qeList.meta.totalCount}>
      <BaseDialog
        title="품질평가"
        description="평가할 체크리스트를 선택해주세요."
        open={open}
        setOpen={setOpen}
        triggerChildren={<IconButton icon="Plus" />}
      >
        <SelectEvaluateItem onClose={() => setOpen(false)} />
      </BaseDialog>
    </CommonPagination>
  );
};

export default QePagination;

const SelectEvaluateItem = ({ onClose }: { onClose: () => void }) => {
  const { evaluateList, getEvaluateList, loadingKeys } = useQeStore();
  const { isLoading, hasError } = useUIStore();
  const [selectItem, setSelectItem] = useState<EvaluateListItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    getEvaluateList();
  }, []);

  const handleEvaluate = () => {
    if (!selectItem) return toast.error("평가항목을 선택해주세요");

    const params = new URLSearchParams({
      serviceTypeSeq: selectItem.serviceTypeSeq.toString(),
      divCodeSeq: selectItem.divCodeSeq.toString(),
      typeCodeSeq: selectItem.typeCodeSeq.toString(),
    });
    onClose();
    router.push(`/qe/add?${params.toString()}`);
  };

  if (isLoading(loadingKeys.EVALUATE_LIST) || !evaluateList)
    return (
      <div className="flex flex-col gap-4 overflow-hidden w-full px-6">
        {Array.from({ length: 6 }, (_, i) => (
          <BaseSkeleton key={i} className="h-14.5" />
        ))}
      </div>
    );
  if (hasError(loadingKeys.EVALUATE_LIST)) return <div>에러 발생</div>;

  return (
    <div className="flex flex-col gap-6 w-full">
      <ScrollArea className="overflow-hidden">
        <div className="px-6 pb-2">
          <div className="flex flex-col gap-4">
            {evaluateList.map((e, i) => (
              <CustomCard
                className={`flex-row gap-4 items-center p-4 cursor-pointer ${
                  selectItem === e && "border-blue-500 bg-blue-50"
                } hover:bg-blue-50 hover:border-blue-500`}
                key={i}
                size={"sm"}
                onClick={() => setSelectItem(e)}
              >
                <span className="text-blue-500 text-sm">
                  {e.serviceTypeName}
                </span>
                <span>
                  {e.divCodeName}({e.typeCodeName})
                </span>
              </CustomCard>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="shrink-0 px-6">
        <Button label="평가" onClick={handleEvaluate} />
      </div>
    </div>
  );
};
