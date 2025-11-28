"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import { cn } from "@/lib/utils";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useUIStore } from "@/store/common/ui-store";

//체크리스트 기본정보
const ChecklistInfo = () => {
  const { checklistDetail, loadingKeys } = useChecklistDetailStore();
  const { isLoading, hasError } = useUIStore();

  const getData = () => {
    if (isLoading(loadingKeys.INFO) || !checklistDetail)
      return (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }, (_, i) => (
            <BaseSkeleton className="w-full h-5" key={i} />
          ))}
        </div>
      );
    if (hasError(loadingKeys.INFO)) return <div>에러 발생</div>;
    return (
      <div className="flex flex-col gap-2">
        <KeyValue
          label={"업무 분야"}
          value={checklistDetail?.serviceTypeName}
        />
        <KeyValue label={"관리 부문"} value={checklistDetail?.divCodeName} />
        <KeyValue label={"관리 유형"} value={checklistDetail?.typeCodeName} />
      </div>
    );
  };

  return (
    <div className="w-full xl:w-150 flex flex-col gap-4">
      <AppTitle title="체크리스트 기본정보" />
      {getData()}
    </div>
  );
};

export const KeyValue = ({
  label,
  value,
  valueSize,
}: {
  label: string;
  value: string;
  valueSize?: string;
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[var(--description-light)]">{label}</span>
      <span className={cn("text-sm text-[var(--description-dark)]", valueSize)}>
        {value}
      </span>
    </div>
  );
};

export default ChecklistInfo;
