import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import CustomDatetimePicker from "../date-input/date-picker";

interface DateFormItemProps {
  label?: string;
  value: Date | null;
  required?: boolean;
  setHour?: boolean;
  onChange: (date: Date) => void;
}

export const DateFormItem = ({
  label,
  value,
  onChange,
  setHour = false,
  required = false,
}: DateFormItemProps) => {
  return (
    <FormItem className="g-2">
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <CustomDatetimePicker
          value={value}
          onChange={(date) => onChange(date)}
          setHour={setHour}
        />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};
