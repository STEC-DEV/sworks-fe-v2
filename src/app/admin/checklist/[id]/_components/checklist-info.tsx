"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";

//체크리스트 기본정보
const ChecklistInfo = () => {
  const { checklistDetail } = useChecklistDetailStore();
  return (
    <div className="w-125 flex flex-col gap-4">
      <AppTitle title="체크리스트 기본정보" />
      {checklistDetail ? (
        <div className="flex flex-col gap-2">
          <KeyValue
            label={"업무 분야"}
            value={checklistDetail?.serviceTypeName}
          />
          <KeyValue label={"관리 부문"} value={checklistDetail?.divCodeName} />
          <KeyValue label={"관리 유형"} value={checklistDetail?.typeCodeName} />
        </div>
      ) : (
        <BaseSkeleton className="w-full h-50" />
      )}
    </div>
  );
};

const KeyValue = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[var(--description-light)]">{label}</span>
      <span className="text-sm text-[var(--description-dark)]">{value}</span>
    </div>
  );
};

export default ChecklistInfo;
