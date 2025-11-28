"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  QeChecklist,
  QeDetail,
  QeEditChecklist,
  QeMain,
  QeSub,
  QeViewChecklist,
  QeViewMain,
} from "@/types/normal/qe/checklist";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { CheckIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Button from "@/components/common/button";
import { useQeDetailStore } from "@/store/normal/qe/qe-detail-store";
import { useDecodeParam } from "@/hooks/params";

// QeDetail 스키마
export const qeDetailSchema = z.object({
  chkDetailSeq: z.number(),
  chkDetailTitle: z.string(),
  chkDetailItem: z.string(),
  score: z.number().optional(),
  chkPoint: z.number(),
});

// QeSub 스키마
export const qeSubSchema = z.object({
  chkSubSeq: z.number(),
  chkSubTitle: z.string(),
  chkSubSumYn: z.boolean(),
  chkSubTotal: z.number(),
  details: z.array(qeDetailSchema),
});

// QeMain 스키마 (이것만 있으면 됨!)
export const qeMainSchema = z.object({
  chkMainSeq: z.number(),
  chkMainTitle: z.string(),
  chkMainSumYn: z.boolean(),
  chkMainTotal: z.number(),
  subs: z.array(qeSubSchema),
});
export type QeMainFormType = z.infer<typeof qeMainSchema>;
export type QeDetailFormType = z.infer<typeof qeDetailSchema>;
export type QeSubFormType = z.infer<typeof qeSubSchema>;

const QeEditForm = ({
  data,
  onClose,
}: {
  data: QeViewMain;
  onClose: () => void;
}) => {
  const { qeDetail, putUpdateLog, getQeDetail } = useQeDetailStore();
  const { rawValue: id } = useDecodeParam("id");
  const defaultValues: QeMainFormType = {
    chkMainSeq: data.chkMainSeq,
    chkMainTitle: data.chkMainTitle,
    chkMainSumYn: data.chkMainSumYn,
    chkMainTotal: data.chkMainTotalScore,
    subs: data.subs,
  };
  const form = useForm<QeMainFormType>({
    resolver: zodResolver(qeMainSchema),
    defaultValues,
  });

  const convertViewChecklistToChecklist = (
    viewChecklist: QeViewChecklist,
    updatedMain?: QeMain
  ): QeEditChecklist => {
    return {
      siteSeq: viewChecklist.siteSeq,
      logSeq: viewChecklist.logSeq,
      siteName: viewChecklist.siteName,
      serviceTypeSeq: viewChecklist.serviceTypeSeq,
      serviceTypeName: viewChecklist.serviceTypeName,
      divCodeSeq: viewChecklist.divCodeSeq,
      divCodeName: viewChecklist.divCodeName,
      typeCodeSeq: viewChecklist.typeCodeSeq,
      typeCodeName: viewChecklist.typeCodeName,
      mains: viewChecklist.mains.map((viewMain) => {
        // 수정된 main이 있고, 해당 main이면 교체
        if (updatedMain && viewMain.chkMainSeq === updatedMain.chkMainSeq) {
          return updatedMain;
        }
        // 그 외는 ViewMain을 Main으로 변환
        return convertViewMainToMain(viewMain);
      }),
    };
  };

  const convertViewMainToMain = (viewMain: QeViewMain): QeMain => {
    return {
      chkMainSeq: viewMain.chkMainSeq,
      chkMainTitle: viewMain.chkMainTitle,
      chkMainSumYn: viewMain.chkMainSumYn,
      chkMainTotal: viewMain.chkMainTotalScore, // 또는 chkMainTotalPoint 중 선택
      subs: viewMain.subs, // QeSub는 동일
    };
  };

  const onSubmit = async (values: QeMainFormType) => {
    if (!qeDetail || !id) return;

    const updatedChecklist = convertViewChecklistToChecklist(qeDetail, values);

    await putUpdateLog(updatedChecklist);
    onClose();
    await getQeDetail(id);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={form.handleSubmit(onSubmit, (err) => console.log(err))}
      >
        <ScrollArea className="overflow-hidden">
          <div className="px-6 pb-1">
            <div className="flex flex-col gap-12">
              {data.subs.map((sub, subIndex) => (
                <QeEditSubSection
                  key={sub.chkSubSeq}
                  sub={sub}
                  subIdx={subIndex}
                  form={form}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
        <div className="flex gap-2 justify-center items-center border-t-1 border-border py-4 ">
          <span className="text-sm">총점</span>
          <span className="text-lg text-blue-500 font-medium">
            {form.watch("chkMainTotal")}
          </span>
        </div>
        <div className="shrink-0 px-6">
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default QeEditForm;

export const QeEditDetailItem = ({
  detail,
  subIdx,
  detailIdx,
  form,
}: {
  detail: QeDetail;
  subIdx: number;
  detailIdx: number;
  form: UseFormReturn<QeMainFormType>;
}) => {
  const handleScoreChange = (score: number) => {
    //score 변경
    form.setValue(`subs.${subIdx}.details.${detailIdx}.score`, score);

    const subs = form.getValues("subs");
    const subTotal = subs[subIdx].details.reduce((sum, detail) => {
      return (sum = sum + (detail.score ?? 0));
    }, 0);

    form.setValue(`subs.${subIdx}.chkSubTotal`, subTotal);
    const mainTotal = subs.reduce((total, sub) => {
      const subSum = sub.details.reduce((sum, detail) => {
        return sum + (detail.score ?? 0);
      }, 0);
      return total + subSum;
    }, 0);
    form.setValue("chkMainTotal", mainTotal);
  };
  return (
    <div className="flex flex-col gap-1 xl:gap-0">
      <span className="text-[var(--description-light)]">
        {detail.chkDetailTitle}
      </span>
      <div className="flex flex-col gap-4">
        <div className="flex items-end gap-2">
          <span className="font-medium">{detail.chkDetailItem}</span>
          <span className="whitespace-nowrap text-[var(--description-light)]">
            ({detail.chkPoint}점)
          </span>
        </div>
        <FormField
          control={form.control}
          name={`subs.${subIdx}.details.${detailIdx}.score`} // mainIdx 제거
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    {Array.from({ length: detail.chkPoint + 1 }, (_, score) => {
                      return (
                        <div
                          key={score}
                          //   onClick={() => {
                          //     field.onChange(score);
                          //   }}
                          onClick={() => handleScoreChange(score)}
                          className={`w-10 h-10 aspect-square rounded-4xl border border-b flex items-center justify-center
                         text-sm bg-blue-50 text-[var(--description-dark)] 
                         cursor-pointer hover:bg-blue-500 hover:text-white ease-in-out duration-150
                         ${
                           field.value === score ? "bg-blue-500 text-white" : ""
                         }
                         `}
                        >
                          {score}
                        </div>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage className="text-xs text-red-500" />
              </FormItem>
            );
          }}
        />
      </div>
    </div>
  );
};
export const QeEditSubSection = ({
  sub,
  subIdx,
  form,
}: {
  sub: QeSub;
  subIdx: number;
  form: UseFormReturn<QeMainFormType>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <CheckIcon className="text-blue-500" />
        <span className="text-lg font-semibold">{sub.chkSubTitle}</span>
      </div>

      <div className="flex flex-col gap-12">
        {sub.details.map((detail, detailIdx) => (
          <QeEditDetailItem
            key={detail.chkDetailSeq}
            detail={detail}
            subIdx={subIdx}
            detailIdx={detailIdx}
            form={form}
          />
        ))}
      </div>
    </div>
  );
};
