import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { InputSearch } from "@/components/common/input";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useReqDetailStore } from "@/store/normal/req/detail";
import { RequestWorker } from "@/types/normal/request/req-detail";
import React, { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

interface UserInputProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const UserInput = ({ value, onChange }: UserInputProps) => {
  const [selected, setSelected] = useState<RequestWorker[]>([]);
  const [curSelect, setCurSelect] = useState<RequestWorker[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { reqWorker, getClassificationReqManager } = useReqDetailStore();

  useEffect(() => {
    if (!open) return;
    getClassificationReqManager();

    return () => {
      handleCancel();
    };
  }, [open]);

  // ✅ reqWorker 로드 후 초기 selected 설정 (최초 1회만)
  useEffect(() => {
    if (!reqWorker || selected.length > 0) return;
    const managers = reqWorker.filter((worker) => worker.isManager === true);
    setSelected(managers);
  }, [reqWorker]);

  // ✅ 다이얼로그 열 때마다 curSelect를 selected로 초기화
  useEffect(() => {
    if (open) {
      setCurSelect([...selected]); // 깊은 복사
    }
  }, [open, selected]);

  const handleSelect = (worker: RequestWorker) => {
    setCurSelect((prev) => {
      const isSelect = prev.some((p) => p.userSeq === worker.userSeq);

      return isSelect
        ? prev.filter((p) => p.userSeq !== worker.userSeq)
        : [...prev, worker];
    });
  };

  const handleSave = () => {
    setSelected([...curSelect]); // 깊은 복사
    onChange(curSelect.map((s) => s.userSeq));
    setOpen(false);
  };

  const handleCancel = () => {
    setCurSelect([...selected]);
    setOpen(false);
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <ScrollArea>
        <div className="flex flex-row gap-2">
          {selected.map((v, i) => (
            <span
              className="bg-background text-[var(--description-light)] px-2 rounded-2xl text-sm"
              key={i}
            >
              {v.userName}
            </span>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <BaseDialog
        title="담당자"
        triggerChildren={<IconButton icon="SquarePen" />}
        open={open}
        setOpen={setOpen}
      >
        <div className="w-full flex flex-col gap-6">
          <div className="px-6">
            <InputSearch />
          </div>

          <ScrollArea>
            <div className="flex flex-col gap-4 px-6">
              {reqWorker?.map((v, i) => (
                <CustomCard
                  className={`flex-row justify-between ${
                    curSelect.find((s) => s.userSeq === v.userSeq)
                      ? "bg-blue-50 border-blue-500"
                      : ""
                  }`}
                  variant={"list"}
                  onClick={() => handleSelect(v)}
                  key={i}
                >
                  <span className="text-sm">{v.userName}</span>
                  <span className="text-sm text-blue-500">
                    {v.serviceTypeName}
                  </span>
                </CustomCard>
              ))}
            </div>
          </ScrollArea>
          <div className="px-6">
            <Button label="저장" onClick={handleSave} />
          </div>
        </div>
      </BaseDialog>
    </div>
  );
};

interface UserInputFormItemProps<TField extends FieldValues = FieldValues> {
  required?: boolean;
  onValueChange: (value: number[]) => void;
  value: number[];
}

export const UserInputFormItem = ({
  required,
  onValueChange,
  value,
}: UserInputFormItemProps) => {
  return (
    <FormItem className="flex flex-col gap-2 w-full">
      <div className="flex">
        <span className="text-xs text-[var(--description-light)]">담당자</span>

        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <UserInput value={value} onChange={onValueChange} />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

export default UserInput;
