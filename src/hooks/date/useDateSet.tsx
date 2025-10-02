import { format, isAfter, isBefore } from "date-fns";

import { UseFormReturn } from "react-hook-form";

interface useDateValidationProps {
  form: UseFormReturn<any>;
  startFieldName?: string;
  endFieldName?: string;
  dateOnly?: boolean;
}

const useDateValidation = ({
  form,
  startFieldName = "startDt",
  endFieldName = "endDt",
  dateOnly = false,
}: useDateValidationProps) => {
  const handleDateChange = (
    type: "start" | "end",
    date: Date,
    onChange: (...event: any[]) => void
  ) => {
    const currentValue = form.getValues();
    //시작날짜가 종료날짜보다 이후인 경우
    if (type === "start") {
      if (
        isAfter(date, currentValue[endFieldName]) &&
        currentValue[endFieldName]
      ) {
        onChange(dateOnly ? format(date, "yyyy-MM-dd") : date);
        form.setValue("endDt", dateOnly ? format(date, "yyyy-MM-dd") : date);
      } else {
        onChange(dateOnly ? format(date, "yyyy-MM-dd") : date);
      }
    }

    //종료날짜가 시작날짜보다 이전인 경우
    if (type === "end") {
      if (isBefore(date, currentValue[startFieldName])) {
        onChange(dateOnly ? format(date, "yyyy-MM-dd") : date);
        form.setValue("startDt", dateOnly ? format(date, "yyyy-MM-dd") : date);
      } else {
        onChange(dateOnly ? format(date, "yyyy-MM-dd") : date);
      }
    }

    // console.log("바뀐날짜 시작 : ", form.getValues().startedAt);
    // console.log("바뀐날짜 정료 : ", form.getValues().endedAt);
  };
  return {
    handleDateChange,
  };
};

export default useDateValidation;
