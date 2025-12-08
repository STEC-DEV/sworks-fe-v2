"use client";
import z from "zod";

const formSchema = z.object({});

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTaskStore } from "@/store/normal/task/task-store";
import {
  SelectTaskChecklist,
  TaskChecklist,
  TaskChecklistSub,
} from "@/types/normal/task/checklist";
import { useDecodeParam } from "@/hooks/params";
import { ScrollArea } from "@/components/ui/scroll-area";
import BaseSkeleton from "@/components/common/base-skeleton";
import { ChecklistSelectAccordion } from "./add2";
import Button from "@/components/common/button";
import { useUIStore } from "@/store/common/ui-store";

const ChkEditForm = ({
  onSubmit,
}: {
  onSubmit: (values: Record<string, any>) => void;
}) => {
  const { loadingKeys, updateChkClassification, getChecklistClassification } =
    useTaskStore();
  const { isLoading, hasError } = useUIStore();
  const [selectedChecklist, setSelectedChecklist] = useState<
    SelectTaskChecklist[]
  >([]);
  const { rawValue: id } = useDecodeParam("id");

  useEffect(() => {
    getChecklistClassification(id);
  }, []);

  useEffect(() => {
    if (!updateChkClassification) return;
    console.log(updateChkClassification);

    //isMainStatus - true
    const selectedMain: SelectTaskChecklist[] = updateChkClassification
      .filter((m) => m.isMainStatus)
      .map((m) => ({
        chkMainSeq: m.chkMainSeq,
        chkMainTitle: m.chkMainTitle,
        chkSubs: m.subs
          .filter((s) => s.isSubStatus)
          .map((s) => ({
            chkSubSeq: s.chkSubSeq,
            chkSubTitle: s.chkSubTitle,
          })),
      }));

    console.log(selectedMain);

    //isMainStatus - false
    const selectedSubs: SelectTaskChecklist[] = updateChkClassification
      .filter((m) => !m.isMainStatus)
      .map((m) => ({
        chkMainSeq: m.chkMainSeq,
        chkMainTitle: m.chkMainTitle,
        chkSubs: m.subs
          .filter((s) => s.isSubStatus)
          .map((s) => ({
            chkSubSeq: s.chkSubSeq,
            chkSubTitle: s.chkSubTitle,
          })),
      }))
      .filter((m) => m.chkSubs.length > 0);

    setSelectedChecklist([...selectedMain, ...selectedSubs]);
  }, [updateChkClassification]);

  if (
    isLoading(loadingKeys.UPDATE_CHK_CLASSIFICATION) ||
    !updateChkClassification
  )
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <BaseSkeleton key={i} className="h-20" />
        ))}
      </div>
    );

  if (hasError(loadingKeys.UPDATE_CHK_CLASSIFICATION))
    return <div>에러 발생</div>;

  const handleMainCheck = useCallback(
    (isCheck: boolean, data: TaskChecklist) => {
      setSelectedChecklist((prev) => {
        const exists = prev.find((item) => item.chkMainSeq === data.chkMainSeq);

        // 체크 해제
        if (!isCheck) {
          return prev.filter((item) => item.chkMainSeq !== data.chkMainSeq);
        }

        // 체크
        if (exists) {
          // 이미 있으면 모든 subs로 업데이트
          return prev.map((item) =>
            item.chkMainSeq === data.chkMainSeq
              ? {
                  ...item,
                  chkSubs: data.subs.map((s) => ({
                    chkSubSeq: s.chkSubSeq,
                    chkSubTitle: s.chkSubTitle,
                  })),
                }
              : item
          );
        }

        // 새로 추가
        return [
          ...prev,
          {
            chkMainSeq: data.chkMainSeq,
            chkMainTitle: data.chkMainTitle,
            chkSubs: data.subs.map((s) => ({
              chkSubSeq: s.chkSubSeq,
              chkSubTitle: s.chkSubTitle,
            })),
          },
        ];
      });
    },
    []
  );

  const handleSubCheck = useCallback(
    (isCheck: boolean, sub: TaskChecklistSub, main: TaskChecklist) => {
      setSelectedChecklist((prev) => {
        const exists = prev.find((item) => item.chkMainSeq === main.chkMainSeq);

        if (!exists) {
          if (isCheck) {
            return [
              ...prev,
              {
                chkMainSeq: main.chkMainSeq,
                chkMainTitle: main.chkMainTitle,
                chkSubs: [
                  {
                    chkSubSeq: sub.chkSubSeq,
                    chkSubTitle: sub.chkSubTitle,
                  },
                ],
              },
            ];
          }
          return prev;
        }

        return prev
          .map((item) => {
            if (item.chkMainSeq !== main.chkMainSeq) return item;

            if (isCheck) {
              const subExists = item.chkSubs.some(
                (s) => s.chkSubSeq === sub.chkSubSeq
              );
              if (subExists) return item;

              return {
                ...item,
                chkSubs: [
                  ...item.chkSubs,
                  {
                    chkSubSeq: sub.chkSubSeq,
                    chkSubTitle: sub.chkSubTitle,
                  },
                ],
              };
            } else {
              const updatedSubs = item.chkSubs.filter(
                (s) => s.chkSubSeq !== sub.chkSubSeq
              );

              if (updatedSubs.length === 0) {
                return null;
              }

              return {
                ...item,
                chkSubs: updatedSubs,
              };
            }
          })
          .filter((item) => item !== null) as SelectTaskChecklist[];
      });
    },
    []
  );

  const handleSave = async () => {
    //display
    // const display = updateChkClassification
    //   .filter((item) =>
    //     selectedChecklist.some(
    //       (select) => select.chkMainSeq === item.chkMainSeq
    //     )
    //   )
    //   .map((item) => {
    //     const selectItem = selectedChecklist.find(
    //       (select) => select.chkMainSeq === item.chkMainSeq
    //     );
    //     const subItem =
    //       selectItem?.chkSubs.length === 0
    //         ? item.subs
    //         : item.subs.filter((displaySub) =>
    //             selectItem?.chkSubs.some(
    //               (selectedSub) =>
    //                 selectedSub.chkSubSeq === displaySub.chkSubSeq
    //             )
    //           );
    //     return {
    //       ...item,
    //       subs: subItem,
    //     };
    //   });

    console.log(selectedChecklist);

    onSubmit({ mains: selectedChecklist });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6">
          <div className="flex flex-col gap-4">
            {updateChkClassification.map((item, i) => (
              <ChecklistSelectAccordion
                data={item}
                key={i}
                selectedValue={selectedChecklist}
                onMainChange={handleMainCheck}
                onSubChange={handleSubCheck}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="px-6 flex-shrink-0">
        <Button label="저장" onClick={handleSave} />
      </div>
    </div>
  );
};

export default ChkEditForm;
