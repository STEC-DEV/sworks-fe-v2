import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import Input from "@/components/common/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { CircleCheck } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ChecklistDialog = ({
  setOpen,
}: // onChange,
{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // onChange: (value: Checklist[]) => void;
}) => {
  const {
    availableChecklistItem,
    selectedAvailableChecklistItem,
    updateSelectedAvailableChecklistItem,
    resetAvailableChecklistItem,
    getAvailableChecklistItem,
  } = useWorkplaceDetailChecklistStore();
  const { id, types } = useParams();
  const [search, setSearch] = useState<string>("");
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist[]>(
    selectedAvailableChecklistItem ?? []
  );

  useEffect(() => {
    if (selectedAvailableChecklistItem) {
      setSelectedChecklist(selectedAvailableChecklistItem);
    }
  }, [selectedAvailableChecklistItem]);

  useEffect(() => {
    if (!id) return;

    if (id && types) {
      const [a, b, c] = types.toString().split("-");
      getAvailableChecklistItem(id?.toString(), a, b, c);
    } else {
      getAvailableChecklistItem(id?.toString());
    }

    //언마운트시 초기화
    return () => {
      resetAvailableChecklistItem();
    };
  }, []);

  const isChecked = (item: Checklist) => {
    return selectedChecklist.some(
      (selected) => selected.chkMainSeq === item.chkMainSeq
    );
  };

  //선택 함수
  const handleCheck = (item: Checklist) => {
    setSelectedChecklist((prev) => {
      const isSelected = prev.some(
        (selected) => selected.chkMainSeq === item.chkMainSeq
      );
      if (isSelected) {
        return prev.filter(
          (selected) => selected.chkMainSeq !== item.chkMainSeq
        );
      } else {
        return [...prev, item];
      }
    });
  };

  //저장
  const handleSubmit = async () => {
    updateSelectedAvailableChecklistItem(selectedChecklist);
    // onChange(selectedChecklist);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full ">
      {/* <Input
        className="w-full"
        placeholder="사업장명"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      /> */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className="flex flex-col gap-2 px-6 pb-1">
          {availableChecklistItem ? (
            availableChecklistItem.map((c, i) => (
              <ChecklistCard
                key={i}
                item={c}
                isChecked={isChecked(c)}
                onClick={handleCheck}
              />
            ))
          ) : (
            <BaseSkeleton className="h-full" />
          )}
        </div>
      </ScrollArea>
      <div className="shrink-0 px-6">
        <Button label="저장" onClick={handleSubmit} />
      </div>
    </div>
  );
};

interface ChecklistCardProps {
  item: Checklist;
  isChecked: boolean;
  onClick: (item: Checklist) => void;
}

const ChecklistCard = ({ item, isChecked, onClick }: ChecklistCardProps) => {
  return (
    <CustomCard
      className={`${
        isChecked ? "border-blue-500 bg-blue-50" : null
      } flex-row items-center`}
      variant={"list"}
      onClick={() => onClick(item)}
    >
      <CircleCheck className="text-blue-500" strokeWidth={1.5} />
      <span className="text-sm ">{item.chkMainTitle}</span>
    </CustomCard>
  );
};

export default ChecklistDialog;
