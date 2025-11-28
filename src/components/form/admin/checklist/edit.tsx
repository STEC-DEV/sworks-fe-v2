"use client";
import Button from "@/components/common/button";
import CheckFormItem from "@/components/common/form-input/check-field";
import { TextFormItem } from "@/components/common/form-input/text-field";
import IconButton from "@/components/common/icon-button";

import { Form, FormField } from "@/components/ui/form";
import { useChecklistDetailStore } from "@/store/admin/checklist/checklist-detail-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  chkMainTitle: z.string("평가항목명을 입력해주세요."),
  sumYn: z.boolean(),
  subs: z.array(
    z.object({
      chkSubSeq: z.number(),
      chkSubTitle: z.string().min(1, "점검항목명을 입력해주세요."),
      sumYn: z.boolean(),
      details: z.array(
        z.object({
          chkDetailSeq: z.number(),
          chkDetailTitle: z.string().min(1, "세부항목명을 입력해주세요."),
          chkItem: z.string().min(1, "세부내용을 입력해주세요."),
          chkDetailPoint: z.number().min(0, "0점 이상 입력해주세요."),
        })
      ),
    })
  ),
});

type FormType = z.infer<typeof formSchema>;

const subInit = {
  chkSubSeq: 0,
  chkSubTitle: "",
  sumYn: false,
  details: [
    {
      chkDetailSeq: 0,
      chkDetailTitle: "",
      chkItem: "",
      chkDetailPoint: 0,
    },
  ],
};

const detailInit = {
  chkDetailSeq: 0,
  chkDetailTitle: "",
  chkItem: "",
  chkDetailPoint: 0,
};

const ChecklistItemEditForm = () => {
  const router = useRouter();
  const { editChecklistItem, putEditChecklistItem } = useChecklistDetailStore();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chkMainTitle: "",
      sumYn: false,
      subs: [subInit],
    },
  });

  useEffect(() => {
    console.log(editChecklistItem);
  }, [editChecklistItem]);

  // 데이터 로드 후 폼 값 업데이트
  useEffect(() => {
    if (editChecklistItem) {
      form.reset({
        chkMainTitle: editChecklistItem.chkMainTitle,
        sumYn: editChecklistItem.sumYn,
        subs:
          editChecklistItem.subs?.map((sub) => ({
            chkSubSeq: sub.chkSubSeq,
            chkSubTitle: sub.chkSubTitle,
            sumYn: sub.sumYn,
            details:
              sub.details?.map((detail) => ({
                chkDetailSeq: detail.chkDetailSeq,
                chkDetailTitle: detail.chkDetailTitle,
                chkItem: detail.chkItem,
                chkDetailPoint: detail.chkDetailPoint,
              })) || [],
          })) || [],
      });
    }
  }, [editChecklistItem, form]);

  const {
    fields: subFields,
    append: appendSub,
    remove: removeSub,
  } = useFieldArray({
    control: form.control,
    name: "subs",
  });

  const SubItem = ({ idx }: { idx: number }) => {
    const {
      fields: detailFields,
      append: appendDetail,
      remove: removeDetail,
    } = useFieldArray({
      control: form.control,
      name: `subs.${idx}.details`,
    });

    return (
      <div className="flex flex-col gap-2 ">
        <div className="flex justify-between items-center">
          <span className="text-sm">점검항목 {idx + 1}</span>

          <div className="flex gap-4 ">
            <IconButton
              icon="Plus"
              onClick={() => appendDetail(detailInit)}
              size={16}
            />
            {subFields.length >= 2 ? (
              <IconButton
                icon="Trash2"
                size={16}
                onClick={() => removeSub(idx)}
              />
            ) : null}
          </div>
        </div>

        <div className="p-6 border border-[var(--border)]  rounded-[4px] bg-white">
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name={`subs.${idx}.chkSubTitle`}
              render={({ field }) => (
                <TextFormItem
                  label="점검항목명"
                  placeholder="점검항목명"
                  required
                  {...field}
                />
              )}
            />
            {detailFields.map((d, i) => {
              return (
                <div key={d.id} className="flex flex-col gap-2 ">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">세부항목 {i + 1}</span>
                    {detailFields.length >= 2 ? (
                      <IconButton
                        icon="Trash2"
                        size={16}
                        onClick={() => removeDetail(i)}
                      />
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`subs.${idx}.details.${i}.chkDetailTitle`}
                      render={({ field }) => (
                        <TextFormItem
                          label="세부항목"
                          placeholder="세부항목"
                          required
                          {...field}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`subs.${idx}.details.${i}.chkItem`}
                      render={({ field }) => (
                        <TextFormItem
                          label="세부내용"
                          placeholder="세부내용"
                          required
                          {...field}
                        />
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`subs.${idx}.details.${i}.chkDetailPoint`}
                      render={({ field }) => {
                        return (
                          <TextFormItem
                            label="배점"
                            placeholder="배점"
                            type="number"
                            min={0}
                            required
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? 0
                                  : parseInt(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  const handleSubmit = async (values: FormType) => {
    if (!editChecklistItem) return;
    const submitData: Checklist = {
      chkMainSeq: editChecklistItem?.chkMainSeq,
      chkMainTitle: values.chkMainTitle,
      sumYn: values.sumYn,
      subs: values.subs.map((sub) => ({
        ...sub,
        details: sub.details.map((d) => ({
          ...d,
          chkDetailPoint: d.chkDetailPoint,
        })),
      })),
    };

    await putEditChecklistItem(submitData);

    router.back();
  };
  const handleError = (errors: any) => {
    console.log("Form 에러:", errors);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(handleSubmit, handleError)}
      >
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold">평가항목</span>
            <IconButton
              icon="Plus"
              size={16}
              onClick={() => appendSub(subInit)}
            />
          </div>

          <div className="flex flex-col gap-6 p-6 border border-[var(--border)] bg-[var(--background)]">
            <FormField
              control={form.control}
              name="chkMainTitle"
              render={({ field }) => (
                <TextFormItem
                  label="평가항목명"
                  placeholder="평가항목명"
                  required
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="sumYn"
              render={({ field }) => (
                <CheckFormItem
                  label="평가항목 소계 사용"
                  description="평가항목 소계 미사용 시 자동 점검항목 소계사용"
                  checked={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
            {/* //소계 체크 */}
            {subFields.map((v, i) => (
              <SubItem key={i} idx={i} />
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button label="저장" size={"sm"} />
        </div>
      </form>
    </Form>
  );
};

export default ChecklistItemEditForm;
