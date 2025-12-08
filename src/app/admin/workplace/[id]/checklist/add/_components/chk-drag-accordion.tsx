import { CheckItemWrapper } from "@/app/admin/checklist/[id]/_components/chk-accordion";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import { useSortable } from "@dnd-kit/sortable";
import { CircleCheckBig, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import { useContext } from "react";

const DraggableCheckAccordion = ({ data }: { data: Checklist }) => {
  const handleDeleteItem = () => {};
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({ id: data.chkMainSeq });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : undefined,
  };

  return (
    <div className="flex gap-2" ref={setNodeRef} style={style}>
      <DragHandle
        attributes={attributes}
        listeners={listeners}
        setActivatorNodeRef={setActivatorNodeRef}
      />
      <CustomAccordion
        label={data.chkMainTitle}
        icon={CircleCheckBig}
        isPaddingBottom={false}
      >
        {data.subs.map((v, i) => (
          <CheckItemWrapper key={i} data={v} />
        ))}
      </CustomAccordion>
    </div>
  );
};

const DragHandle = ({
  attributes,
  listeners,
  setActivatorNodeRef,
}: {
  attributes: any;
  listeners: any;
  setActivatorNodeRef: any;
}) => {
  return (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      className="px-2 rounded-[4px] hover:cursor-pointer hover:bg-[var(--background)]"
    >
      <GripVertical className="text-[var(--icon)]" size={20} />
    </button>
  );
};

export default DraggableCheckAccordion;
