import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import React from "react";
import Input, { CheckBox } from "../input";
import { FieldValues } from "react-hook-form";
import { SelectOption } from "@/types/common/select-item";

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
    <FormItem className="gap-1 w-full">
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

interface MultiCheckBoxFormItemProps<T extends FieldValues>
  extends Omit<React.ComponentProps<"input">, "type" | "value"> {
  label?: string;
  description?: string;
  data: SelectOption[];
  value: string;
  required?: boolean;
}

export const MultiCheckBoxFormItem = <T extends FieldValues>({
  label,
  description,
  value,
  data,
  onChange,
  required = false,
  ...props
}: MultiCheckBoxFormItemProps<T>) => {
  return (
    <FormItem className="flex flex-col gap-2 w-full">
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <div className="flex gap-6 items-center">
          {data.map((v, i) => {
            return (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-sm ">{v.key}</span>
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={v.value.toString() === value}
                  onChange={onChange}
                  value={v.value}
                />
              </div>
            );
          })}
        </div>
      </FormControl>

      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};
