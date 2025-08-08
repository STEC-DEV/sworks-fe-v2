import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import React from "react";
import Input from "../input";
import { FieldValues } from "react-hook-form";

interface CheckFormItemProps<T extends FieldValues>
  extends Omit<React.ComponentProps<"input">, "type" | "value"> {
  label?: string;
  description?: string;
  checked: boolean;
  required?: boolean;
}

const CheckFormItem = <T extends FieldValues>({
  label,
  description,
  checked,
  onChange,
  required = false,
  ...props
}: CheckFormItemProps<T>) => {
  return (
    <FormItem className="gap-1">
      <div className="flex items-center gap-4">
        <div className="flex">
          {label ? <span className="text-xs text-black">{label}</span> : null}
          {required ? <span className="text-xs text-red-500">*</span> : null}
        </div>
        <FormControl>
          <Input
            className="w-fit h-fit hover:cursor-pointer"
            type="checkbox"
            checked={checked}
            onChange={onChange}
            {...props}
          />
        </FormControl>
      </div>

      {description ? (
        <span className="text-xs text-[var(--description-light)]">
          {description}
        </span>
      ) : null}

      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

export default CheckFormItem;
