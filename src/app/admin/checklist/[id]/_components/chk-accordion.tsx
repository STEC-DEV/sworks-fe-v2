import CustomAccordion from "@/components/common/accordion/custom-accordion";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import dialogText from "../../../../../../public/dialog-text.json";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CircleCheckBig } from "lucide-react";

const ChkAccordion = ({ data }: { data: Checklist }) => {
  const router = useRouter();
  const { id } = useParams();

  const handleDeleteItem = () => {};
  return (
    <CustomAccordion
      label={data.chkMainTitle}
      icon={CircleCheckBig}
      optionChildren={
        <div className="flex gap-2">
          <IconButton
            icon="SquarePen"
            size={16}
            onClick={() => router.push(`${id}/${data.chkMainSeq}`)}
          />
          <CheckDialog
            title={dialogText.checklistItemDelete.title}
            description={dialogText.checklistItemDelete.description}
            actionLabel={dialogText.checklistItemDelete.actionLabel}
            onClick={() => {}}
          >
            <IconButton icon="Trash2" size={16} />
          </CheckDialog>
        </div>
      }
    >
      {data.subs.map((v, i) => (
        <CheckItemWrapper key={i} data={v} />
      ))}
    </CustomAccordion>
  );
};

export const CheckItemWrapper = ({ data }: { data: ChecklistItem }) => {
  return (
    <div>
      <span className="block px-4 py-2 bg-[var(--background)]">
        {data.chkSubTitle}
      </span>
      <div className="flex flex-col gap-4 p-4">
        {data.details.map((v, i) => (
          <CheckItem key={i} item={v} />
        ))}
      </div>
    </div>
  );
};

export const CheckItem = ({ item }: { item: ChecklistItemDetail }) => {
  return (
    <div className="flex justify-between items-center ">
      <div className="flex flex-col gap-1">
        <span className="text-sm">{item.chkDetailTitle}</span>
        <span className="text-xs text-[var(--description-light)]">
          {item.chkItem}
        </span>
      </div>
      <div className="px-4 py-1 bg-blue-500 text-white text-sm rounded-[4px]">
        {item.chkPoint}점
      </div>
    </div>
  );
};

export default ChkAccordion;
