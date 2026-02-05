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
  const [search, setSearch] = useState<string>(""); // ✨ 추가: 검색어 state
  const { reqWorker, getClassificationReqManager } = useReqDetailStore();

  useEffect(() => {
    if (!open) return;
    getClassificationReqManager();

    return () => {
      setCurSelect([...selected]);
      setOpen(false);
    };
  }, [open, getClassificationReqManager]);

  // ✅ reqWorker 로드 후 초기 selected 설정 (최초 1회만)
  useEffect(() => {
    if (!reqWorker || selected.length > 0) return;
    const managers = reqWorker.filter((worker) => worker.isManager === true);

    setSelected(managers);
  }, [reqWorker, setSelected]);

  // ✅ value prop이 변경되면 selected 동기화 (form.reset() 시 빈 배열로 초기화)
  useEffect(() => {
    if (!reqWorker) return;

    // value가 빈 배열이면 selected도 비우기
    if (value.length === 0) {
      setSelected([]);
      return;
    }

    // value에 해당하는 worker들로 selected 설정
    const selectedWorkers = reqWorker.filter((worker) =>
      value.includes(worker.userSeq),
    );
    setSelected(selectedWorkers);
  }, [value, reqWorker]);

  // ✅ 다이얼로그 열 때마다 curSelect를 selected로 초기화
  useEffect(() => {
    if (open) {
      setCurSelect([...selected]); // 깊은 복사
      setSearch(""); // ✨ 추가: 다이얼로그 열 때 검색어 초기화
    }
  }, [open, selected]);

  // ✨ 추가: 검색 필터링 로직
  const filteredWorkers = reqWorker?.filter((worker) => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;

    return (
      worker.userName.toLowerCase().includes(searchLower) ||
      worker.serviceTypeName.toLowerCase().includes(searchLower)
    );
  });

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

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-2 flex-wrap">
        {selected.length === 0 ? (
          <span className="text-sm text-[var(--placeholder)]">담당자 없음</span>
        ) : null}
        {selected.map((v, i) => (
          <span
            className="px-4 py-0.5  bg-blue-500 text-white  rounded-2xl text-sm"
            key={i}
          >
            {v.userName}
          </span>
        ))}
      </div>

      <BaseDialog
        title="담당자"
        triggerChildren={<IconButton icon="SquarePen" />}
        open={open}
        setOpen={setOpen}
      >
        <div className="w-full flex flex-col gap-6">
          <div className="px-6">
            {/* 🔄 수정: InputSearch → Input으로 변경 */}
            <InputSearch
              placeholder="담당자명 또는 서비스 유형 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ScrollArea className="flex-1  overflow-hidden ">
            <div className="px-6 pb-1 ">
              <div className="flex flex-col gap-4">
                {/* 🔄 수정: reqWorker → filteredWorkers로 변경 */}
                {filteredWorkers && filteredWorkers.length > 0 ? (
                  filteredWorkers.map((v, i) => (
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
                  ))
                ) : (
                  // ✨ 추가: 검색 결과 없을 때 메시지
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
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

//<TField extends FieldValues = FieldValues>
interface UserInputFormItemProps {
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
