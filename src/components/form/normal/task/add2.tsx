import CustomAccordion from "@/components/common/accordion/custom-accordion";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import IconButton from "@/components/common/icon-button";
import { CheckBox } from "@/components/common/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonFormContainer from "@/components/ui/custom/form/form-container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskStore } from "@/store/normal/task/task-store";
import {
  SelectTaskChecklist,
  TaskChecklist,
  TaskChecklistSub,
} from "@/types/normal/task/checklist";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z, { check } from "zod";

const formSchema = z.object({});

type ChecklistFormType = z.infer<typeof formSchema>;

const ChecklistAddForm = ({
  onNext,
  onPrev,
}: {
  onNext: (values: Record<string, any>) => void;
  onPrev: () => void;
}) => {
  const { createTask, taskChecklist, getChecklist } = useTaskStore();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedChecklist, setSelectedChecklist] = useState<
    SelectTaskChecklist[]
  >(createTask.chkMains);
  const [displaySelectedChecklist, setDisplaySelectedChecklist] = useState<
    TaskChecklist[]
  >([]);
  const form = useForm<ChecklistFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    getChecklist();
  }, []);

  useEffect(() => {
    handleDisplayValue();
  }, [selectedChecklist]);

  const handleSelected = (data: SelectTaskChecklist[]) => {
    setSelectedChecklist(data);
    // setDisplaySelectedChecklist(displayData);
    setOpen(false);
  };

  const handleDisplayValue = () => {
    if (!taskChecklist) return;
    const display = taskChecklist
      .filter((item) =>
        selectedChecklist.some(
          (select) => select.chkMainSeq === item.chkMainSeq
        )
      )
      .map((item) => {
        const selectItem = selectedChecklist.find(
          (select) => select.chkMainSeq === item.chkMainSeq
        );
        const subItem =
          selectItem?.chkSubs.length === 0
            ? item.subs
            : item.subs.filter((displaySub) =>
                selectItem?.chkSubs.some(
                  (selectedSub) =>
                    selectedSub.chkSubSeq === displaySub.chkSubSeq
                )
              );
        return {
          ...item,
          subs: subItem,
        };
      });

    setDisplaySelectedChecklist(display);
  };

  const handleSubmit = () => {
    onNext({ chkMains: selectedChecklist });
  };

  return (
    <CommonFormContainer
      form={form}
      title="평가항목"
      nextLabel="다음"
      onPrev={onPrev}
      onNext={handleSubmit}
      titleOptionChildren={
        <BaseDialog
          triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
          title="평가항목 수정"
          open={open}
          setOpen={setOpen}
        >
          <ChecklistEditContents
            value={selectedChecklist}
            onChange={handleSelected}
          />
        </BaseDialog>
      }
    >
      <div className="flex flex-col gap-4">
        {displaySelectedChecklist.map((item, i) => (
          <DisPlayTaskChecklistAccordion key={i} data={item} />
        ))}
      </div>
    </CommonFormContainer>
  );
};

export default ChecklistAddForm;

const ChecklistEditContents = ({
  value,
  onChange,
}: {
  value: SelectTaskChecklist[];
  onChange: (data: SelectTaskChecklist[]) => void;
}) => {
  const { createTask, getChecklist } = useTaskStore();
  const [checklist, setChecklist] = useState<TaskChecklist[]>([]);
  const [selectedChecklist, setSelectedChecklist] =
    useState<SelectTaskChecklist[]>(value);

  useEffect(() => {
    getChecklistData();
  }, []);

  const getChecklistData = async () => {
    const checklist = await getChecklist();

    if (checklist.code === 500 || !checklist.data) return;
    setChecklist(checklist.data);
  };

  // const handleMainCheck = useCallback(
  //   (isCheck: boolean, data: TaskChecklist) => {
  //     console.log(isCheck);
  //     //해제 경우
  //     if (!isCheck) {
  //       setSelectedChecklist((prev) => {
  //         console.log(prev.filter((v) => v.chkMainSeq !== data.chkMainSeq));
  //         return prev.filter((v) => v.chkMainSeq !== data.chkMainSeq);
  //       });
  //       return;
  //     } else {
  //       //전체선택
  //       setSelectedChecklist((prev) => {
  //         const select = prev.find((v) => v.chkMainSeq === data.chkMainSeq);
  //         return select
  //           ? //기존 메인에 sub가 일부 존재하는경우 sub를 지우고 main만 남겨야함
  //             prev.map((item) =>
  //               item.chkMainSeq === data.chkMainSeq
  //                 ? {
  //                     ...item,
  //                     chkSubs: [],
  //                   }
  //                 : item
  //             )
  //           : [
  //               //기존에 없었던경우에는 sub를 제외한 메인만 추가
  //               ...prev,
  //               {
  //                 chkMainSeq: data.chkMainSeq,
  //                 chkMainTitle: data.chkMainTitle,
  //                 chkSubs: [],
  //               },
  //             ];
  //       });
  //     }
  //   },
  //   []
  // );

  // //서브항목 체크
  // const handleSubCheck = useCallback(
  //   (isCheck: boolean, data: TaskChecklistSub, main: TaskChecklist) => {
  //     //체크 경우
  //     if (isCheck) {
  //       setSelectedChecklist((prev) => {
  //         const select = prev.find((v) => v.chkMainSeq === main.chkMainSeq);
  //         //메인은 존재하는경우 -> 일부 sub값이 선택되어있는것임
  //         if (select) {
  //           const result = prev.map((item) =>
  //             item.chkMainSeq === main.chkMainSeq
  //               ? {
  //                   ...item,
  //                   chkSubs: [...item.chkSubs, data],
  //                 }
  //               : item
  //           );
  //           //sub 2개 존재하는경우 기존에 1개 추가되어있다가 1개 더 추가되었을떄 sub를 없애줘야함
  //           return main.subs.length ===
  //             result.find((item) => item.chkMainSeq === main.chkMainSeq)
  //               ?.chkSubs.length
  //             ? result.map((item) =>
  //                 item.chkMainSeq === main.chkMainSeq
  //                   ? { ...item, chkSubs: [] }
  //                   : item
  //               )
  //             : result;
  //         } else {
  //           const newItem = {
  //             chkMainSeq: main.chkMainSeq,
  //             chkMainTitle: main.chkMainTitle,
  //             chkSubs: [data],
  //           };

  //           const selectedSubCount = newItem.chkSubs.length;
  //           const totalSubCount = main.subs.length;

  //           //아예 선택되지않은것임
  //           return selectedSubCount === totalSubCount
  //             ? [
  //                 ...prev,
  //                 {
  //                   chkMainSeq: main.chkMainSeq,
  //                   chkMainTitle: main.chkMainTitle,
  //                   chkSubs: [], // 전체 선택
  //                 },
  //               ]
  //             : [...prev, newItem];
  //         }
  //       });
  //     } else {
  //       //전체센택되면 SUB가 없음 근데 한개를 지우면  나머지 두개는 존재해야하기에 넣어줘야함

  //       setSelectedChecklist((prev) => {
  //         const select = prev.find(
  //           (item) => item.chkMainSeq === main.chkMainSeq
  //         );
  //         //select는 항상존재할 수 밖에 없음.
  //         if (!select) return prev;

  //         //1. 메인은 존재하는데 서브가 존재하지않는 경우. 즉, 전체선택인 경우
  //         if (select.chkSubs.length === 0) {
  //           //해제한 sub가 아닌 나머지 sub
  //           const rest = main.subs.filter(
  //             (sub) => sub.chkSubSeq !== data.chkSubSeq
  //           );
  //           if (rest.length === 0) {
  //             return prev.filter((item) => item.chkMainSeq !== main.chkMainSeq);
  //           }
  //           return prev.map((item) =>
  //             item.chkMainSeq === main.chkMainSeq
  //               ? {
  //                   ...item,
  //                   chkSubs: rest,
  //                 }
  //               : item
  //           );
  //         } else {
  //           //2. 일부서브들만 선택된 상황에서 해제

  //           return prev
  //             .map((item) => {
  //               //해당 sub제거
  //               if (item.chkMainSeq === main.chkMainSeq) {
  //                 const newSubs = item.chkSubs.filter(
  //                   (sub) => sub.chkSubSeq !== data.chkSubSeq
  //                 );

  //                 //2-1. 마지막 sub를 삭제하는경우는 메인도 지워야함
  //                 if (newSubs.length === 0) {
  //                   return null;
  //                 }

  //                 return { ...item, chkSubs: newSubs };
  //               }
  //               return item;
  //             })
  //             .filter((item) => item !== null);
  //         }
  //       });
  //     }
  //   },
  //   []
  // );

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

  const handleSave = () => {
    //display
    const display = checklist
      .filter((item) =>
        selectedChecklist.some(
          (select) => select.chkMainSeq === item.chkMainSeq
        )
      )
      .map((item) => {
        const selectItem = selectedChecklist.find(
          (select) => select.chkMainSeq === item.chkMainSeq
        );
        const subItem =
          selectItem?.chkSubs.length === 0
            ? item.subs
            : item.subs.filter((displaySub) =>
                selectItem?.chkSubs.some(
                  (selectedSub) =>
                    selectedSub.chkSubSeq === displaySub.chkSubSeq
                )
              );
        return {
          ...item,
          subs: subItem,
        };
      });

    onChange(selectedChecklist);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6">
          <div className="flex flex-col gap-4">
            {checklist.map((item, i) => (
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
        <Button label="저장" onClick={() => handleSave()} />
      </div>
    </div>
  );
};

export const ChecklistSelectAccordion = ({
  data,
  selectedValue,
  onMainChange,
  onSubChange,
}: {
  data: TaskChecklist;
  selectedValue: SelectTaskChecklist[];
  onMainChange: (isCheck: boolean, data: TaskChecklist) => void;
  onSubChange: (
    isCheck: boolean,
    data: TaskChecklistSub,
    main: TaskChecklist
  ) => void;
}) => {
  // Main 체크 상태 계산
  const isMainCheck = useMemo(() => {
    const selected = selectedValue.find(
      (v) => v.chkMainSeq === data.chkMainSeq
    );

    if (!selected) return false;

    // 모든 subs가 선택되어 있는지 확인
    if (selected.chkSubs.length !== data.subs.length) return false;

    // 모든 sub의 seq가 일치하는지 확인
    return data.subs.every((sub) =>
      selected.chkSubs.some((s) => s.chkSubSeq === sub.chkSubSeq)
    );
  }, [selectedValue, data.chkMainSeq, data.subs]);

  // Sub 체크 상태 계산
  const isSubChecked = useCallback(
    (sub: TaskChecklistSub) => {
      const select = selectedValue.find(
        (item) => item.chkMainSeq === data.chkMainSeq
      );

      if (!select) return false;
      if (select.chkSubs.length === 0) return true; // 전체 선택
      return select.chkSubs.some((item) => item.chkSubSeq === sub.chkSubSeq);
    },
    [selectedValue, data.chkMainSeq]
  );

  return (
    <Accordion
      type="single"
      collapsible
      className={`border border-[var(--border)] rounded-[4px] shadow-sm bg-white w-full ${
        isMainCheck ? "border-blue-500 !bg-blue-50" : null
      }`}
    >
      <AccordionItem value={data.chkMainTitle.toString()}>
        <AccordionTrigger
          className={` px-4 py-4 hover:no-underline items-center focus-visible:ring-0 focus-visible:outline-none
        
          `}
        >
          <div className="flex items-center gap-4">
            <div onClick={(e) => e.stopPropagation()}>
              <CheckBox
                checked={isMainCheck}
                onChange={(e) => onMainChange(e.target.checked, data)}
              />
            </div>
            <span className="text-sm">{data.chkMainTitle}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {data.subs.map((sub, i) => {
            const select = selectedValue.find(
              (item) => item.chkMainSeq === data.chkMainSeq
            );

            return (
              <div
                key={`${sub.chkSubTitle}-${sub.chkSubSeq}`}
                className="px-6 flex items-center gap-4 text-[var(--description-dark)]"
              >
                <CheckBox
                  checked={isSubChecked(sub)}
                  onChange={(e) => onSubChange(e.target.checked, sub, data)}
                />
                <span>{sub.chkSubTitle}</span>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const DisPlayTaskChecklistAccordion = ({ data }: { data: TaskChecklist }) => {
  return (
    <Accordion
      type="single"
      collapsible
      className={`border border-[var(--border)] rounded-[4px] shadow-sm bg-white w-full `}
    >
      <AccordionItem value={data.chkMainTitle.toString()}>
        <AccordionTrigger
          className={` px-4 py-4 hover:no-underline items-center focus-visible:ring-0 focus-visible:outline-none
        
          `}
        >
          <div className="flex items-center gap-4">
            <CircleCheckBig
              className="w-5 h-5 text-blue-500 "
              strokeWidth={1.5}
            />
            <span className="text-sm">{data.chkMainTitle}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2">
          {data.subs.map((sub, i) => {
            return (
              <div
                key={`${sub.chkSubTitle}-${sub.chkSubSeq}`}
                className="px-6 flex items-center gap-4 text-[var(--description-dark)]"
              >
                <span>{sub.chkSubTitle}</span>
              </div>
            );
          })}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
