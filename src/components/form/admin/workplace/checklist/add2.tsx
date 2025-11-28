"use client";
import ChecklistDialog from "@/app/admin/workplace/[id]/checklist/add/_components/checklist-dialog";
import DraggableCheckAccordion from "@/app/admin/workplace/[id]/checklist/add/_components/chk-drag-accordion";
import IconButton from "@/components/common/icon-button";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useWorkplaceDetailChecklistStore } from "@/store/admin/workplace/checklist-store";

const formSchema = z.object({
  chkMainSeq: z
    .array(z.number())
    .min(1, "최소 1개 이상 평가항목을 추가해주세요."),
});

export type ChecklistAddFormType = z.infer<typeof formSchema>;

interface ChecklistAddFormProps {
  onPrev?: () => void;
  onNext: (values: ChecklistAddFormType) => void;
}

const ChecklistAddForm = ({ onPrev, onNext }: ChecklistAddFormProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    selectedAvailableChecklistItem,
    updateSelectedAvailableChecklistItem,
  } = useWorkplaceDetailChecklistStore();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // 로컬 상태로 드래그 가능한 아이템들 관리
  const [items, setItems] = useState(selectedAvailableChecklistItem || []);
  const { createChecklist } = useWorkplaceDetailChecklistStore();

  const form = useForm<ChecklistAddFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chkMainSeq: items.map((item) => item.chkMainSeq),
    },
  });

  useEffect(() => {
    updateSelectedAvailableChecklistItem([]);
  }, []);

  useEffect(() => {
    setItems(selectedAvailableChecklistItem);
    form.setValue(
      "chkMainSeq",
      selectedAvailableChecklistItem.map((v) => v.chkMainSeq)
    );
  }, [selectedAvailableChecklistItem]);

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
      const newItems = arrayMove(items, activeIndex, overIndex);
      setItems(newItems);
      updateSelectedAvailableChecklistItem(newItems);
      form.setValue(
        "chkMainSeq",
        newItems.map((i) => i.chkMainSeq)
      );
    }
  };

  const handleFormFieldChange = (selectItem: Checklist[]) => {
    const dataSeq = selectItem.map((i) => i.chkMainSeq);
    form.setValue("chkMainSeq", dataSeq);
  };

  return (
    <CommonFormContainer
      title="평가항목"
      form={form}
      nextLabel="생성"
      onNext={onNext}
      onPrev={onPrev}
      titleOptionChildren={
        <BaseDialog
          triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
          title="평가항목 수정"
          open={open}
          setOpen={setOpen}
        >
          <ChecklistDialog setOpen={setOpen} />
          {/* onChange={handleFormFieldChange} */}
        </BaseDialog>
      }
    >
      <FormField
        control={form.control}
        name="chkMainSeq"
        render={({ field }) => (
          <FormItem>
            <FormMessage className="text-red-500" />
            <FormControl>
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
            </FormControl>
          </FormItem>
        )}
      />
    </CommonFormContainer>
  );
};

export default ChecklistAddForm;
