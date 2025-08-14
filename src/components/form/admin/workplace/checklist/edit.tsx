"use client";
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
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import AppTitle from "@/components/common/label/title";
import Button from "@/components/common/button";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  chkMainSeq: z
    .array(z.number())
    .min(1, "최소 1개 이상 평가항목을 추가해주세요."),
});

export type ChecklistEditFormType = z.infer<typeof formSchema>;

const WorkplaceChecklistEditForm = () => {
  const { id, types } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const {
    checklistDetail,
    selectedAvailableChecklistItem,
    updateSelectedAvailableChecklistItem,
    putUpdateChecklist,
  } = useWorkplaceDetailStore();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  // 로컬 상태로 드래그 가능한 아이템들 관리
  const [items, setItems] = useState<Checklist[]>([]);

  const form = useForm<ChecklistEditFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chkMainSeq: [],
    },
  });

  useEffect(() => {
    return () => {
      //언마운트 시 초기화
      updateSelectedAvailableChecklistItem([]);
    };
  }, []);
  //기존 데이터 동기화
  useEffect(() => {
    if (!checklistDetail) return;
    setItems(checklistDetail?.mains);
    updateSelectedAvailableChecklistItem(checklistDetail?.mains);
    const initialSeq = checklistDetail.mains.map((item) => item.chkMainSeq);
    form.setValue("chkMainSeq", initialSeq);
  }, [checklistDetail]);
  //다이얼로그에서 항목 변경한경우
  useEffect(() => {
    if (selectedAvailableChecklistItem) {
      setItems(selectedAvailableChecklistItem);
      const newSeq = selectedAvailableChecklistItem.map(
        (item) => item.chkMainSeq
      );
      form.setValue("chkMainSeq", newSeq);
    }
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

  const handleSubmit = async (values: ChecklistEditFormType) => {
    if (!types || !id) return;
    const [serviceTypeSeq, divCodeSeq, typeCodeSeq] = types
      ?.toString()
      .split("-");
    const submitData: CreateChecklist = {
      serviceTypeSeq: parseInt(serviceTypeSeq),
      divCodeSeq: parseInt(divCodeSeq),
      typeCodeSeq: parseInt(typeCodeSeq),
      ...values,
    };
    await putUpdateChecklist(id.toString(), submitData);

    router.back();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="flex justify-between items-center">
          <AppTitle title="평가항목" />
          <BaseDialog
            triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
            title="평가항목 수정"
            open={open}
            setOpen={setOpen}
          >
            <ChecklistDialog setOpen={setOpen} />
            {/* onChange={handleFormFieldChange} */}
          </BaseDialog>
        </div>

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
        <Button label="저장" />
      </form>
    </Form>
  );
};

export default WorkplaceChecklistEditForm;
