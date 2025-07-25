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
  required = false,
  ...props
}: TextFormItemProps<T>) => {
  return (
    <FormItem className="flex flex-col gap-2">
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>

      <FormControl>
        <Input {...props} />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

/**
 * 비밀번호 입력 받는 폼 컴포넌트
 * --
 * */
export const PasswordTextFormItem = <T extends FieldValues>({
  label,
  required = true,
  ...props
}: TextFormItemProps<T>) => {
  return (
    <FormItem className="flex flex-col gap-2">
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>

      <FormControl>
        <PasswordInput {...props} />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};
