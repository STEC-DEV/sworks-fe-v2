import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectOption } from "@/types/common/select-item";
import { SelectProps } from "@radix-ui/react-select";
import React, { useEffect } from "react";
import { FieldValues } from "react-hook-form";

interface TextFormItemProps<TField extends FieldValues = FieldValues>
  extends SelectProps {
  label?: string;
  required?: boolean;
  onValueChange: (value: string) => void;
  defaultValue: string | undefined;
  selectItem: SelectOption[];
}

const SelectFormItem = <T extends FieldValues>({
  label,
  required,
  selectItem,
  onValueChange,
  defaultValue,
  ...props
}: TextFormItemProps<T>) => {
  useEffect(() => {
    console.log(label, "초기값");

    console.log(defaultValue);
  }, [defaultValue]);
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
      <Select
        onValueChange={(value) => onValueChange(value)}
        value={defaultValue}
        {...props}
      >
        <FormControl>
          <SelectTrigger
            className={`w-full text-sm  rounded-[4px] border border-[var(--border)] shadow-none transition duration-300
                focus-visible:border-[var(--primary)] focus-visible:border-1 focus-visible:ring-1 focus-visible:ring-[var(--primary)]
                hover:border-[var(--primary)] hover:cursor-pointer
                data-[placeholder]:text-[var(--placeholder)] data-[state=open]:ring-[var(--primary)] data-[state=open]:border-[var(--primary)] data-[state=open]:ring-1 data-[state=open]:ring-inset
                `}
          >
            <SelectValue placeholder={label} />
          </SelectTrigger>
        </FormControl>
        <FormMessage className="text-xs text-red-500" />
        <SelectContent className="rounded-[4px] bg-white">
          {selectItem.length > 0 ? (
            selectItem.map((v, i) => (
              <SelectItem
                className={`
                 rounded-[4px]
                hover:cursor-pointer hover:hover:bg-[var(--background)]
                `}
                key={i}
                value={v.value.toString()}
              >
                {v.key}
              </SelectItem>
            ))
          ) : (
            <span className="px-2 py-1.5 text-sm text-[var(--description-dark)] ">
              이전 값을 선택해주세요.
            </span>
          )}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default SelectFormItem;
