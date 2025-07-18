import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import { FieldValues } from "react-hook-form";
import Input, { PasswordInput } from "../input";

interface TextFormItemProps<T extends FieldValues>
  extends React.ComponentProps<"input"> {
  label?: string;
  required?: boolean;
}
/**
 * 문자열 입력 받는 폼 컴포넌트
 * --
 * */
export const TextFormItem = <T extends FieldValues>({
  label,
  required = true,
  ...props
}: TextFormItemProps<T>) => {
  return (
    <FormItem className="flex flex-col gap-2">
      {label ? (
        <span className="text-xs text-[var(--description-light)]">{label}</span>
      ) : null}
      <FormControl>
        <Input {...props} />
      </FormControl>
    </FormItem>
  );
};

/**
 * 텍스트 입력 받는 폼 컴포넌트
 * --
 * */
export const PasswordTextFormItem = <T extends FieldValues>({
  label,
  required = true,
  ...props
}: TextFormItemProps<T>) => {
  return (
    <FormItem className="flex flex-col gap-2">
      {label ? (
        <span className="text-xs text-[var(--description-light)]">{label}</span>
      ) : null}
      <FormControl>
        <PasswordInput {...props} />
      </FormControl>
    </FormItem>
  );
};
