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
  title: z.string().min(1, "제목을 입력하세요."),
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
      title: "",
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
      title: schedule.title,
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
        className="flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit, (err) => {
          console.log(err);
        })}
      >
        <div className="flex flex-col gap-4 h-full pb-1">
          {enteredWorkplace?.contracts ? (
            <FormField
              control={form.control}
              name="serviceTypeSeq"
              render={({ field }) => {
                const handleValue = (value: string) => {
                  field.onChange(Number(value));
                };

                return (
                  <SelectFormItem
                    label="업무 유형"
                    selectItem={convertSelectOptionType(
                      enteredWorkplace.contracts ?? [],
                    )}
                    onValueChange={handleValue}
                    value={field.value?.toString()}
                    required
                  />
                );
              }}
            />
          ) : null}
          <FormField
            control={form.control}
            name="title"
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

          <div className="flex flex-col xl:flex-row gap-6">
            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => {
                //종일선택 시 날짜 값 초기화
                const handleAllDay = (values: boolean) => {
                  if (values) {
                    form.setValue("startDt", new Date());
                    form.setValue("endDt", new Date());
                  }

                  field.onChange(values);
                };

                return (
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-[var(--description-light)]">
                      종일
                    </span>
                    <div className="flex-1 flex items-center">
                      <Switch
                        className="ring ring-[var(--border)]  hover:cursor-pointer data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-[var(--background)] [&_[data-slot=switch-thumb]]:bg-white focus-visible:ring-0 focus-visible:outline-none"
                        checked={field.value}
                        onCheckedChange={handleAllDay}
                      />
                    </div>
                  </div>
                );
              }}
            />
            <FormField
              control={form.control}
              name="startDt"
              render={({ field }) => {
                const allDay = !form.watch("isAllDay");
                return (
                  <DateFormItem
                    label="시작"
                    value={field.value}
                    onChange={(date) => {
                      console.log(date);
                      handleDateChange("start", date, field.onChange);
                    }}
                    setHour={allDay}
                    required
                  />
                );
              }}
            />
            <FormField
              control={form.control}
              name="endDt"
              render={({ field }) => {
                const allDay = !form.watch("isAllDay");
                return (
                  <DateFormItem
                    label="종료"
                    value={field.value}
                    onChange={(date) =>
                      handleDateChange("end", date, field.onChange)
                    }
                    setHour={allDay}
                  />
                );
              }}
            />
          </div>

          <FormField
            control={form.control}
            name="alarmDt"
            render={({ field }) => {
              const handleValue = (value: string) => {
                field.onChange(Number(value));
              };

              return (
                <AlarmTimeFormItem
                  label="알람"
                  value={field.value}
                  onChange={field.onChange}
                  isAlarm={form.watch("alarmYn")}
                  onAlarmChange={(alarm) => {
                    form.setValue("alarmYn", alarm);
                    if (!alarm) field.onChange(null);
                    else {
                      field.onChange("08:00:00");
                    }
                  }}
                  offsetDay={form.watch("alarmOffSetDays")}
                  onOffsetDayChange={(day) =>
                    form.setValue("alarmOffSetDays", day)
                  }
                />
              );
            }}
          />
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
          <FormField
            name="logs.fileAttaches"
            control={form.control}
            render={({ field }) => {
              const handleRemoveExistFiles = (data: string) => {
                const curRemoveFiles =
                  form.getValues("logs.deleteAttaches") || [];

                form.setValue("logs.deleteAttaches", [
                  ...curRemoveFiles,
                  parseInt(data),
                ]);
              };

              const existedFiles = () => {
                const removeFiles = form.watch("logs.deleteAttaches") || [];
                if (!schedule?.logs?.files) return [];
                return schedule?.logs.files
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
                const newValue = files.map((file) => ({
                  attachSeq: null,
                  photoType: 3, // 기본값 설정
                  attaches: file,
                  comments: "",
                }));
                field.onChange(newValue);
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

          <FormField
            control={form.control}
            name="logs.imageAttaches"
            render={({ field }) => {
              console.log(
                "🟢 FormField render 실행! field.value:",
                field.value,
              );

              const handleValue = (value: ScheduleFormAttach[]) => {
                console.log("🔵 부모 handleValue 호출됨! 받은 값:", value);
                console.log("🔵 현재 field.value:", field.value);

                // 다른 photoType 유지
                const otherImages = field.value.filter(
                  (v) => v.photoType !== 1,
                );

                console.log("🔵 otherImages:", otherImages);
                const newValue = [...otherImages, ...value];
                console.log("🔵 field.onChange 호출! 전달값:", newValue);

                field.onChange(newValue);
              };

              //신규 등록파일 삭제
              const handleDelete = (value: ScheduleFormAttach) => {
                // console.log("신규 삭제 : ", value);

                const delValue = field.value.filter((v) => v !== value);
                field.onChange(delValue);
              };

              //기존 등록파일 삭제
              const handleExistDelete = (value: number) => {
                console.log("기존 삭제", value);
                //현재 삭제된 파일을 제외한 기존파일

                const currentDeleteValue = form.getValues(
                  "logs.deleteAttaches",
                );
                //삭제파일 등록
                form.setValue("logs.deleteAttaches", [
                  ...currentDeleteValue,
                  value,
                ]);
                //만약 기존 파일이 수정된경우 value에 포함되기떄문에 확인 후 삭제
                const newValue = field.value.filter(
                  (v) => v.attachSeq !== value,
                );
                field.onChange(newValue);
              };

              const existedBeforeImages = useMemo(() => {
                return (
                  schedule?.logs?.beforeImages.filter(
                    (v) =>
                      !form.watch("logs.deleteAttaches").includes(v.attachSeq),
                  ) ?? []
                );
              }, [
                schedule?.logs?.beforeImages,
                form.watch("logs.deleteAttaches"),
              ]);

              return (
                <ScheduleImageFileFormItem
                  label="작업 전 이미지 "
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
                // 다른 photoType 유지
                const otherImages = field.value.filter(
                  (v) => v.photoType !== 2,
                );

                // 합치기
                field.onChange([...otherImages, ...value]);
              };

              //신규 등록파일 삭제
              const handleDelete = (value: ScheduleFormAttach) => {
                // console.log("신규 삭제 : ", value);

                const delValue = field.value.filter((v) => v !== value);
                field.onChange(delValue);
              };

              //기존 등록파일 삭제
              const handleExistDelete = (value: number) => {
                console.log("기존 삭제", value);

                const currentDeleteValue = form.getValues(
                  "logs.deleteAttaches",
                );
                //삭제파일 등록
                form.setValue("logs.deleteAttaches", [
                  ...currentDeleteValue,
                  value,
                ]);
                //만약 기존 파일이 수정된경우 value에 포함되기떄문에 확인 후 삭제
                const newValue = field.value.filter(
                  (v) => v.attachSeq !== value,
                );
                field.onChange(newValue);
              };

              const existedAfterImages = useMemo(() => {
                return (
                  schedule?.logs?.afterImages.filter(
                    (v) =>
                      !form.watch("logs.deleteAttaches").includes(v.attachSeq),
                  ) ?? []
                );
              }, [
                schedule?.logs?.afterImages,
                form.watch("logs.deleteAttaches"),
              ]);

              return (
                <ScheduleImageFileFormItem
                  label="작업 후 이미지"
                  key={"일까"}
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

        <div className="shrink-0 ">
          <Button label="저장" />
        </div>
      </form>
    </Form>
  );
};

export default DayScheduleEditForm;
