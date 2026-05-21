"use client";
import Button from "@/components/common/button";
import {
  AlarmTimeFormItem,
  DateFormItem,
} from "@/components/common/form-input/date-field";
import FileFormItem from "@/components/common/form-input/file-field";
import SelectFormItem, {
  SelectColorFormItem,
} from "@/components/common/form-input/select-field";
import {
  TextAreaFormItem,
  TextFormItem,
} from "@/components/common/form-input/text-field";
import { Form, FormField } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import useDateValidation from "@/hooks/date/useDateSet";
import { useAuthStore } from "@/store/auth/auth-store";
import { useScheduleStore } from "@/store/normal/schedule/shcedule-store";
import {
  convertRecordDataToFormData,
  convertSelectOptionType,
  objectToFormData,
} from "@/utils/convert";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  ImageFileItem,
  ScheduleImageFileFormItem,
} from "./_components/file-input";
import {
  ScheduleAttach,
  ScheduleFormAttach,
} from "@/types/normal/schedule/day-schedule";

const EditSchema = z.object({
  schSeq: z.number(),
  serviceTypeSeq: z.number("업무 유형을 선택해주세요.").min(1),
  schTitle: z.string().min(1, "제목을 입력하세요."),
  viewYn: z.boolean(),
  description: z.string(),
  isAllDay: z.boolean(),
  startDt: z.date(),
  endDt: z.date(),
  alarmYn: z.boolean(),
  alarmDt: z.string().nullable(),
  alarmMin: z.number().nullable(),
  alarmOffSetDays: z.number(),
  viewColor: z.string().min(1, "색상을 선택해주세요."),
  logs: z.object({
    logComments: z.string(),
    deleteAttaches: z.array(z.number()),
    imageAttaches: z.array(
      z.object({
        attachSeq: z.number().nullable(),
        photoType: z.number(),
        attaches: z.instanceof(File).nullable(),
        comments: z.string(),
      }),
    ),
    fileAttaches: z.array(
      z.object({
        attachSeq: z.number().nullable(),
        photoType: z.number(),
        attaches: z.instanceof(File).nullable(),
        comments: z.string(),
      }),
    ),
  }),
});

type EditFormType = z.infer<typeof EditSchema>;

interface DayEditFormProps {
  focusDate?: Date;
  isOption?: boolean;
}

const DayScheduleEditForm = ({
  focusDate,
  isOption = false,
}: DayEditFormProps) => {
  const { schedule, resetSchedule, patchUpdateSchedule } = useScheduleStore();
  const router = useRouter();
  const { enteredWorkplace } = useAuthStore();
  const form = useForm<EditFormType>({
    resolver: zodResolver(EditSchema),
    defaultValues: {
      schSeq: undefined,
      serviceTypeSeq: undefined,
      viewYn: false,
      schTitle: "",
      description: "",
      isAllDay: false,
      startDt: new Date(),
      endDt: new Date(),
      alarmYn: false,
      alarmDt: null,
      alarmMin: 0,
      alarmOffSetDays: 0,
      viewColor: "",
      logs: {
        logComments: "",
        deleteAttaches: [],
        imageAttaches: [],
        fileAttaches: [],
      },
    },
  });

  // schedule 데이터가 로드되면 form에 반영
  useEffect(() => {
    if (!schedule) return;

    form.reset({
      schSeq: schedule.schSeq,
      viewYn: schedule.viewYn,
      serviceTypeSeq: schedule.serviceTypeSeq,
      schTitle: schedule.title,
      description: schedule.description ?? "",
      isAllDay: schedule.isAllday,
      startDt: new Date(schedule.startDt),
      endDt: new Date(schedule.endDt),
      alarmYn: schedule.alarmYn,
      alarmDt: schedule.alarmDt,
      alarmMin: 0,
      alarmOffSetDays: schedule.alarmOffsetDays ?? 0,
      viewColor: schedule.viewColor,
      logs: {
        logComments: schedule.logs?.logComments ?? "",
        deleteAttaches: [],
        imageAttaches: [],
        fileAttaches: [],
      },
    });
  }, [schedule]);

  useEffect(() => {
    return () => {
      resetSchedule();
    };
  }, []);

  const handleSubmit = async (values: EditFormType) => {
    console.log(values);
    const payload = {
      ...values,
      startDt: format(values.startDt, "yyyy-MM-dd'T'HH:mm:ss"), // "2025-11-05 09:00:00"
      endDt: format(values.endDt, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    const formData = objectToFormData(payload);
    await patchUpdateSchedule(formData);
    router.push("/schedule");
  };

  const { handleDateChange } = useDateValidation({
    form,
    startFieldName: "startDt",
    endFieldName: "endDt",
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={form.handleSubmit(handleSubmit, (err) => console.log(err))}
      >
        {/* 2열 그리드 */}
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* ── 왼쪽: 기본정보 + 일정 ── */}
          <div className="flex flex-col gap-6">
            {/* 기본정보 카드 */}
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background">
                <span className="text-xs font-bold text-primary">
                  기본 정보
                </span>
              </div>
              <div className="flex flex-col gap-4 p-4">
                {enteredWorkplace?.contracts && (
                  <FormField
                    control={form.control}
                    name="serviceTypeSeq"
                    render={({ field }) => (
                      <SelectFormItem
                        label="업무 유형"
                        selectItem={convertSelectOptionType(
                          enteredWorkplace.contracts ?? [],
                        )}
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value?.toString()}
                        required
                      />
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="schTitle"
                  render={({ field }) => (
                    <TextFormItem
                      label="제목"
                      placeholder="제목"
                      {...field}
                      required
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <TextAreaFormItem
                      label="설명"
                      className="h-20"
                      placeholder="설명"
                      {...field}
                    />
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="viewColor"
                    render={({ field }) => (
                      <SelectColorFormItem
                        label="색상"
                        value={field.value}
                        onChange={field.onChange}
                        required
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="alarmDt"
                    render={({ field }) => (
                      <AlarmTimeFormItem
                        label="알람"
                        value={field.value}
                        onChange={field.onChange}
                        isAlarm={form.watch("alarmYn")}
                        onAlarmChange={(alarm) => {
                          form.setValue("alarmYn", alarm);
                          field.onChange(alarm ? "08:00:00" : null);
                        }}
                        offsetDay={form.watch("alarmOffSetDays")}
                        onOffsetDayChange={(day) =>
                          form.setValue("alarmOffSetDays", day)
                        }
                      />
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="logs.logComments"
                  render={({ field }) => (
                    <TextAreaFormItem
                      label="특이사항"
                      className="h-20"
                      placeholder="특이사항"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            {/* 일정 카드 */}
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background">
                <span className="text-xs font-bold text-primary">일정</span>
              </div>
              <div className="flex flex-col gap-4 p-4">
                <FormField
                  control={form.control}
                  name="isAllDay"
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Switch
                        className="ring ring-border-strong cursor-pointer data-[state=checked]:bg-primary data-[state=unchecked]:bg-skeleton [&_[data-slot=switch-thumb]]:bg-surface focus-visible:ring-0 focus-visible:outline-none"
                        checked={field.value}
                        onCheckedChange={(values) => {
                          if (values) {
                            form.setValue("startDt", new Date());
                            form.setValue("endDt", new Date());
                          }
                          field.onChange(values);
                        }}
                      />
                      <span className="text-sm text-description">종일</span>
                    </div>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="startDt"
                    render={({ field }) => (
                      <DateFormItem
                        label="시작"
                        value={field.value}
                        onChange={(date) =>
                          handleDateChange("start", date, field.onChange)
                        }
                        setHour={!form.watch("isAllDay")}
                        required
                      />
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endDt"
                    render={({ field }) => (
                      <DateFormItem
                        label="종료"
                        value={field.value}
                        onChange={(date) =>
                          handleDateChange("end", date, field.onChange)
                        }
                        setHour={!form.watch("isAllDay")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── 오른쪽: 첨부파일 ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface rounded-xl border border-border shadow-sm overflow-hidden flex flex-col ">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background">
                <span className="text-xs font-bold text-primary">
                  첨부파일 & 이미지
                </span>
              </div>
              <div className="flex flex-col gap-5 p-4">
                <FormField
                  name="logs.fileAttaches"
                  control={form.control}
                  render={({ field }) => {
                    // 기존 로직 동일
                    const handleRemoveExistFiles = (data: string) => {
                      const curRemoveFiles =
                        form.getValues("logs.deleteAttaches") || [];
                      form.setValue("logs.deleteAttaches", [
                        ...curRemoveFiles,
                        parseInt(data),
                      ]);
                    };
                    const existedFiles = () => {
                      const removeFiles =
                        form.watch("logs.deleteAttaches") || [];
                      if (!schedule?.logs?.files) return [];
                      return schedule.logs.files
                        .filter((v) => !removeFiles.includes(v.attachSeq))
                        .map((v) => v.attachSeq.toString());
                    };
                    const fileValue = useMemo(() => {
                      if (!field.value) return [];
                      return field.value
                        .map((v) => v.attaches)
                        .filter((file): file is File => file !== null);
                    }, [field.value]);
                    const handleFileChange = (files: File[]) => {
                      field.onChange(
                        files.map((file) => ({
                          attachSeq: null,
                          photoType: 3,
                          attaches: file,
                          comments: "",
                        })),
                      );
                    };

                    return (
                      <FileFormItem
                        label="첨부파일"
                        accept="accept"
                        multiple={true}
                        {...field}
                        value={fileValue}
                        existingFiles={existedFiles()}
                        onChange={handleFileChange}
                        onRemoveExitedFiles={handleRemoveExistFiles}
                        isVertical
                      />
                    );
                  }}
                />

                {/* 작업전/후 이미지 — 나란히 */}
                <FormField
                  control={form.control}
                  name="logs.imageAttaches"
                  render={({ field }) => {
                    const handleValue = (value: ScheduleFormAttach[]) => {
                      field.onChange([
                        ...field.value.filter((v) => v.photoType !== 1),
                        ...value,
                      ]);
                    };
                    const handleDelete = (value: ScheduleFormAttach) => {
                      field.onChange(field.value.filter((v) => v !== value));
                    };
                    const handleExistDelete = (value: number) => {
                      form.setValue("logs.deleteAttaches", [
                        ...form.getValues("logs.deleteAttaches"),
                        value,
                      ]);
                      field.onChange(
                        field.value.filter((v) => v.attachSeq !== value),
                      );
                    };
                    const existedBeforeImages = useMemo(() => {
                      return (
                        schedule?.logs?.beforeImages.filter(
                          (v) =>
                            !form
                              .watch("logs.deleteAttaches")
                              .includes(v.attachSeq),
                        ) ?? []
                      );
                    }, [
                      schedule?.logs?.beforeImages,
                      form.watch("logs.deleteAttaches"),
                    ]);

                    return (
                      <ScheduleImageFileFormItem
                        label="작업 전 이미지"
                        photoType={1}
                        value={field.value.filter((v) => v.photoType === 1)}
                        onChange={handleValue}
                        existedFile={existedBeforeImages}
                        removeExistedFile={[]}
                        onExistedFileRemove={handleExistDelete}
                        onDeleteFile={handleDelete}
                      />
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="logs.imageAttaches"
                  render={({ field }) => {
                    const handleValue = (value: ScheduleFormAttach[]) => {
                      field.onChange([
                        ...field.value.filter((v) => v.photoType !== 2),
                        ...value,
                      ]);
                    };
                    const handleDelete = (value: ScheduleFormAttach) => {
                      field.onChange(field.value.filter((v) => v !== value));
                    };
                    const handleExistDelete = (value: number) => {
                      form.setValue("logs.deleteAttaches", [
                        ...form.getValues("logs.deleteAttaches"),
                        value,
                      ]);
                      field.onChange(
                        field.value.filter((v) => v.attachSeq !== value),
                      );
                    };
                    const existedAfterImages = useMemo(() => {
                      return (
                        schedule?.logs?.afterImages.filter(
                          (v) =>
                            !form
                              .watch("logs.deleteAttaches")
                              .includes(v.attachSeq),
                        ) ?? []
                      );
                    }, [
                      schedule?.logs?.afterImages,
                      form.watch("logs.deleteAttaches"),
                    ]);

                    return (
                      <ScheduleImageFileFormItem
                        label="작업 후 이미지"
                        photoType={2}
                        value={field.value.filter((v) => v.photoType === 2)}
                        onChange={handleValue}
                        existedFile={existedAfterImages}
                        removeExistedFile={[]}
                        onExistedFileRemove={handleExistDelete}
                        onDeleteFile={handleDelete}
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* 저장 버튼 — 오른쪽 하단 정렬 */}
            <div className="flex justify-end gap-2 shrink-0">
              <Button
                type="button"
                variant={"prev"}
                size={"sm"}
                label="취소"
                onClick={() => router.push("/schedule")}
              />
              <Button type="submit" size={"sm"} label="저장" />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DayScheduleEditForm;
