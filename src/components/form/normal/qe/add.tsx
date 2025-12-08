import z from "zod";
import React, { useState } from "react";
import { useQeStore } from "@/store/normal/qe/qe-store";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUIStore } from "@/store/common/ui-store";
import BaseSkeleton from "@/components/common/base-skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import AppTitle from "@/components/common/label/title";
import { CheckIcon } from "lucide-react";
import Button from "@/components/common/button";

import BaseOverlay from "@/components/common/overlay";
import CustomCard from "@/components/common/card";
import ResultDialog from "@/components/ui/custom/form/result-dialog";

const DetailSchema = z.object({
  chkDetailSeq: z.number(),
  chkDetailTitle: z.string(),
  chkDetailItem: z.string(),
  score: z.number().min(0).optional(),
  chkPoint: z.number(),
});

const SubSchema = z.object({
  chkSubSeq: z.number(),
  chkSubTitle: z.string(),
  chkSubSumYn: z.boolean(),
  chkSubTotal: z.number(),
  details: z.array(DetailSchema),
});

const MainSchema = z.object({
  chkMainSeq: z.number(),
  chkMainTitle: z.string(),
  chkMainSumYn: z.boolean(),
  chkMainTotal: z.number(),
  subs: z.array(SubSchema),
});

const QeAddFormSchema = z.object({
  siteSeq: z.number(),
  siteName: z.string(),
  serviceTypeSeq: z.number(),
  serviceTypeName: z.string(),
  divCodeSeq: z.number(),
  divCodeName: z.string(),
  typeCodeSeq: z.number(),
  typeCodeName: z.string(),
  mains: z.array(MainSchema),
});

export type QeAddFormValueType = z.infer<typeof QeAddFormSchema>;
export type DetailType = z.infer<typeof DetailSchema>;
export type SubType = z.infer<typeof SubSchema>;
export type MainType = z.infer<typeof MainSchema>;

const QeAddForm = () => {
  const { evaluateChecklist, loadingKeys, postAddEvaluate } = useQeStore();
  const { isLoading, hasError } = useUIStore();
  const [curStep, setCurStep] = useState<number>(0);
  const [unscoredDialog, setUnscoredDialog] = useState<{
    open: boolean;
    items: string[];
  }>({ open: false, items: [] });
  const [result, setResult] = useState<boolean>(false);
  const [resultOpen, setResultOpen] = useState<boolean>(false);

  if (isLoading(loadingKeys.EVALUATE_CHECKLIST) || !evaluateChecklist)
    return <BaseSkeleton />;

  const currentMain = evaluateChecklist.mains[curStep];
  const totalSteps = evaluateChecklist.mains.length;

  const form = useForm<QeAddFormValueType>({
    resolver: zodResolver(QeAddFormSchema),
    defaultValues: evaluateChecklist,
  });

  const handleNext = () => {
    if (curStep < totalSteps - 1) {
      setCurStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (curStep > 0) {
      setCurStep((prev) => prev - 1);
    }
  };

  const checkUnscoredItems = (data: QeAddFormValueType) => {
    const unscored: string[] = [];

    data.mains.forEach((main, mainIdx) => {
      main.subs.forEach((sub, subIdx) => {
        sub.details.forEach((detail, detailIdx) => {
          if (detail.score === undefined) {
            unscored.push(
              `${main.chkMainTitle} > ${sub.chkSubTitle} > ${detail.chkDetailTitle}`
            );
          }
        });
      });
    });

    return unscored;
  };

  const onSubmit = async (values: QeAddFormValueType) => {
    console.log(values);
    const unscoredItems = checkUnscoredItems(values);

    if (unscoredItems.length > 0) {
      setUnscoredDialog({
        open: true,
        items: unscoredItems,
      });
      return;
    } else {
      const res = await postAddEvaluate(values);
      setResult(res);
      setResultOpen(true);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 pb-4">
            <AppTitle title={currentMain.chkMainTitle} />
            <span className="text-sm text-gray-500">
              {curStep + 1} / {totalSteps}
            </span>
          </div>

          <div className="space-y-6">
            {currentMain.subs.map((sub, subIndex) => (
              <QeSubSection
                key={sub.chkSubSeq}
                sub={sub}
                mainIdx={curStep}
                subIdx={subIndex}
                form={form}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <Button
            label="이전"
            type="button"
            variant={"prev"}
            size={"sm"}
            onClick={handlePrev}
            disabled={curStep === 0}
          />
          {curStep === totalSteps - 1 ? (
            <Button type="submit" label="제출" size={"sm"} />
          ) : (
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleNext();
              }}
              label="다음"
              size={"sm"}
            />
          )}
        </div>
        <BaseOverlay
          isOpen={unscoredDialog.open}
          closeOnOutsideClick={false}
          onBackClick={() => {}}
        >
          <CustomCard className="xl:w-150 px-6">
            <AppTitle title="미평가 항목" />
            <div className="flex">
              <span className="text-md font-bold">
                {unscoredDialog.items.length}
              </span>
              <span className="text-md">
                개 항목이 아직 평가되지 않았습니다
              </span>
            </div>

            <Button
              label="확인"
              onClick={() => setUnscoredDialog({ open: false, items: [] })}
            />
          </CustomCard>
        </BaseOverlay>
        <ResultDialog
          result={result}
          open={resultOpen}
          setOpen={setResultOpen}
          successUrl="/qe"
          failedUrl="/qe"
        />
      </form>
    </Form>
  );
};

export default QeAddForm;

export const QeDetailItem = ({
  detail,
  mainIdx,
  subIdx,
  detailIdx,
  form,
}: {
  detail: DetailType;
  mainIdx: number;
  subIdx: number;
  detailIdx: number;
  form: UseFormReturn<QeAddFormValueType>;
}) => {
  const handleScore = (score: number) => {
    form.setValue(
      `mains.${mainIdx}.subs.${subIdx}.details.${detailIdx}.score`,
      score
    );

    const subs = form.getValues(`mains.${mainIdx}.subs`);
    const subTotal = subs[subIdx].details.reduce((sum, detail) => {
      return sum + (detail.score ?? 0);
    }, 0);
    form.setValue(`mains.${mainIdx}.subs.${subIdx}.chkSubTotal`, subTotal);

    const mainTotal = subs.reduce((total, sub) => {
      const subSum = sub.details.reduce((sum, detail) => {
        return sum + (detail.score ?? 0);
      }, 0);
      return total + subSum;
    }, 0);
    form.setValue(`mains.${mainIdx}.chkMainTotal`, mainTotal);
  };
  return (
    <div className="flex flex-col gap-1 xl:gap-0">
      <span className=" text-[var(--description-light)]">
        {detail.chkDetailTitle}
      </span>
      <div className="flex flex-col gap-4 xl:flex-row xl:justify-between xl:items-center">
        <div className="flex items-end gap-2">
          <span className="font-medium">{detail.chkDetailItem}</span>
          <span className=" whitespace-nowrap text-[var(--description-light)]">
            ({detail.chkPoint}점)
          </span>
        </div>
        <FormField
          control={form.control}
          name={`mains.${mainIdx}.subs.${subIdx}.details.${detailIdx}.score`}
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <div className="flex gap-4">
                    {Array.from({ length: detail.chkPoint + 1 }, (_, score) => {
                      return (
                        <div
                          key={score}
                          onClick={() => {
                            handleScore(score);
                          }}
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

export const QeSubSection = ({
  sub,
  mainIdx,
  subIdx,
  form,
}: {
  sub: SubType;
  mainIdx: number;
  subIdx: number;
  form: UseFormReturn<QeAddFormValueType>;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <CheckIcon className="text-blue-500" />
        <span className="text-lg font-semibold ">{sub.chkSubTitle}</span>
      </div>

      <div className="flex flex-col gap-4">
        {sub.details.map((detail, i) => (
          <QeDetailItem
            key={i}
            detail={detail}
            mainIdx={mainIdx}
            subIdx={subIdx}
            detailIdx={i}
            form={form}
          />
        ))}
      </div>
    </div>
  );
};
