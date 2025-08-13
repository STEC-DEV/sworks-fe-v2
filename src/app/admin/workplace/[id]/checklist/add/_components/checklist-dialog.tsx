import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import Input from "@/components/common/input";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ChecklistDialog = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    availableChecklistItem,
    selectedAvailableChecklistItem,
    updateSelectedAvailableChecklistItem,
    getAvailableChecklistItem,
  } = useWorkplaceDetailStore();
  const { id } = useParams();
  const [search, setSearch] = useState<string>("");
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist[]>(
    selectedAvailableChecklistItem ?? []
  );

  useEffect(() => {
    if (!id) return;
    getAvailableChecklistItem(id?.toString());
  }, []);

  //선택 함수
  const handleCheck = (item: Checklist) => {
    console.log(item);
    setSelectedChecklist((prev) => {
      return prev.includes(item)
        ? prev.filter((v) => v !== item)
        : [...prev, item];
    });
  };

  useEffect(() => {});

  //저장
  const handleSubmit = async () => {
    updateSelectedAvailableChecklistItem(selectedChecklist);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <Input
        className="w-full"
        placeholder="사업장명"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-2 h-120 overflow-auto">
        {availableChecklistItem ? (
          availableChecklistItem.map((c, i) => (
            <ChecklistCard
              key={i}
              item={c}
              isChecked={selectedChecklist.includes(c)}
              onClick={handleCheck}
            />
          ))
        ) : (
          <BaseSkeleton className="h-full" />
        )}
      </div>
      <Button label="저장" onClick={handleSubmit} />
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
      className={`${isChecked ? "border-blue-500 bg-blue-50" : null}`}
      variant={"list"}
      onClick={() => onClick(item)}
    >
      <span className="text-sm ">{item.chkMainTitle}</span>
    </CustomCard>
  );
};

export default ChecklistDialog;
