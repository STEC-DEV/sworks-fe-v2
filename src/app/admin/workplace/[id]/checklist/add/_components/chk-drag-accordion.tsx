import { CheckItemWrapper } from "@/app/admin/checklist/[id]/_components/chk-accordion";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import { useSortable } from "@dnd-kit/sortable";
import { CircleCheckBig } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";

const DraggableCheckAccordion = ({ data }: { data: Checklist }) => {
  const handleDeleteItem = () => {};
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.chkMainSeq });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : undefined,
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <CustomAccordion label={data.chkMainTitle} icon={CircleCheckBig}>
        {data.subs.map((v, i) => (
          <CheckItemWrapper key={i} data={v} />
        ))}
      </CustomAccordion>
    </div>
  );
};

export default DraggableCheckAccordion;
