import CustomAccordion from "@/components/common/accordion/custom-accordion";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import dialogText from "../../../../../../public/dialog-text.json";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CircleCheckBig } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { useDecodeParam } from "@/hooks/params";

const ChkAccordion = ({ data }: { data: Checklist }) => {
  const { canEdit } = usePermission();
  const { getChecklistDetail, deleteChecklist } = useChecklistDetailStore();
  const router = useRouter();
  const { id } = useParams();
  const { rawValue } = useDecodeParam("id");

  const onDelete = async () => {
    if (!rawValue) return;
    await deleteChecklist(data.chkMainSeq);
    await getChecklistDetail(rawValue);
  };

  return (
    <CustomAccordion
      label={data.chkMainTitle}
      icon={CircleCheckBig}
      optionChildren={
        canEdit && (
          <div className="flex gap-2">
            <IconButton
              icon="SquarePen"
              size={16}
              bgClassName="p-1 w-8 h-8 !rounded-DEFAULT border border-border-strong hover:bg-primary-background shadow-sm"
              onClick={() => router.push(`${id}/${data.chkMainSeq}`)}
            />
            <CheckDialog
              title={dialogText.checklistItemDelete.title}
              description={dialogText.checklistItemDelete.description}
              actionLabel={dialogText.checklistItemDelete.actionLabel}
              onClick={onDelete}
            >
              <IconButton
                icon="Trash2"
                size={16}
                bgClassName="p-1 w-8 h-8 !rounded-DEFAULT border border-border-strong hover:bg-red-50 hover:border-destructive shadow-sm"
                className="group-hover:text-destructive"
              />
            </CheckDialog>
          </div>
        )
      }
      isPaddingBottom={false}
    >
      {data.subs.map((v, i) => (
        <CheckItemWrapper key={i} data={v} />
      ))}
    </CustomAccordion>
  );
};

interface CheckListAccordionProps {
  data: Checklist;
  optionChildren?: React.ReactNode; // 옵션 - 편집, 삭제 버튼과 같은 추가 기능
}

export const ChecklistAccordion = ({
  data,
  optionChildren,
}: CheckListAccordionProps) => {
  return (
    <CustomAccordion
      label={data.chkMainTitle}
      icon={CircleCheckBig}
      optionChildren={optionChildren}
      isPaddingBottom={false}
    >
      <div className="flex flex-col ">
        {data.subs.map((v, i) => (
          <CheckItemWrapper key={i} data={v} />
        ))}
      </div>
    </CustomAccordion>
  );
};

export const CheckItemWrapper = ({ data }: { data: ChecklistItem }) => {
  return (
    <div>
      <span className="block px-4 py-2 bg-background text-primary font-medium">
        {data.chkSubTitle}
      </span>
      <div className="flex flex-col gap-4 px-4 py-4 divide-y divide-border">
        {data.details.map((v, i) => (
          <CheckItem key={i} item={v} />
        ))}
      </div>
    </div>
  );
};

export const CheckItem = ({ item }: { item: ChecklistItemDetail }) => {
  return (
    <div className="flex justify-between items-center pb-4 last:pb-0">
      <div className="flex flex-col gap-1 ">
        <span className="text-sm font-semibold ">{item.chkDetailTitle}</span>
        {item.chkItem && (
          <span className="text-xs text-description font-medium">
            {item.chkItem}
          </span>
        )}
      </div>
      {item.chkDetailPoint ? (
        <div className="whitespace-nowrap px-4 py-1 bg-primary text-white text-sm rounded-DEFAULT">
          {item.chkDetailPoint}점
        </div>
      ) : null}
    </div>
  );
};

export default ChkAccordion;
