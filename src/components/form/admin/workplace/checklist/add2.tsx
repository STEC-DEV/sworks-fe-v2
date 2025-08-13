import ChecklistDialog from "@/app/admin/workplace/[id]/checklist/add/_components/checklist-dialog";
import DraggableCheckAccordion from "@/app/admin/workplace/[id]/checklist/add/_components/chk-drag-accordion";
import IconButton from "@/components/common/icon-button";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import z from "zod";

const formSchema = z.object({
  mains: z.array(z.number()).min(0),
});

type ChecklistAddFormType = z.infer<typeof formSchema>;

interface ChecklistAddFormProps {
  onPrev?: () => void;
  onNext: (values: ChecklistAddFormType) => void;
}

const ChecklistAddForm = ({ onPrev, onNext }: ChecklistAddFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    selectedAvailableChecklistItem,
    updateSelectedAvailableChecklistItem,
  } = useWorkplaceDetailStore();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // 로컬 상태로 드래그 가능한 아이템들 관리
  const [items, setItems] = useState(selectedAvailableChecklistItem || []);

  const form = useForm<ChecklistAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mains: [],
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  //드래그
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  //드롭
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && activeId) {
      const activeIndex = items.findIndex((c) => c.chkMainSeq === activeId);
      const overIndex = items.findIndex((c) => c.chkMainSeq === over.id);
      setItems(arrayMove(items, activeIndex, overIndex));
      updateSelectedAvailableChecklistItem(
        arrayMove(items, activeIndex, overIndex)
      );
    }
  };

  return (
    <CommonFormContainer
      title="평가항목"
      form={form}
      nextLabel="생성"
      onPrev={onPrev}
      onNext={onNext}
      titleOptionChildren={
        <BaseDialog
          triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
          title="평가항목 선택"
          open={open}
          setOpen={setOpen}
        >
          <ChecklistDialog setOpen={setOpen} />
        </BaseDialog>
      }
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-2">
          {items ? (
            <SortableContext items={items.map((c) => c.chkMainSeq)}>
              {items.map((c, i) => (
                <DraggableCheckAccordion key={i} data={c} />
              ))}
            </SortableContext>
          ) : null}
        </div>
      </DndContext>
    </CommonFormContainer>
  );
};

export default ChecklistAddForm;
