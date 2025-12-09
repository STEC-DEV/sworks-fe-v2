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
import React, { useEffect, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { MultiSelect } from "../select-input";

import { Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TriggerButton } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import ColorPicker from "../color-picker";

interface TextFormItemProps<TField extends FieldValues = FieldValues>
  extends SelectProps {
  label?: string;
  required?: boolean;
  onValueChange: (value: string) => void;
  value: string | undefined;
  selectItem: SelectOption[];
}

const SelectFormItem = <T extends FieldValues>({
  label,
  required,
  selectItem,
  onValueChange,
  value,
  ...props
}: TextFormItemProps<T>) => {
  // useEffect(() => {
  //   console.log("값 :", value);
  //   console.log(selectItem.find((i) => i.value.toString() === value));
  // }, [value]);
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
      <Select
        onValueChange={(value) => {
          onValueChange(value);
        }}
        defaultValue={value}
        value={value}
        {...props}
      >
        <FormControl>
          <SelectTrigger
            className={`bg-white w-full text-sm  rounded-[4px] border border-[var(--border)] shadow-none transition duration-300
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
                key={v.value}
                value={v.value.toString()}
              >
                {v.key}
              </SelectItem>
            ))
          ) : (
            <span className="px-2 py-1.5 text-sm text-[var(--placeholder)] ">
              no result
            </span>
          )}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

interface MultiSelectFormItemProps<TField extends FieldValues = FieldValues> {
  label?: string;
  required?: boolean;
  onValueChange: (value: string[]) => void;
  value: string[];
  selectItem: SelectOption[];
}

// 멀티셀렉트
export const MultiSelectFormItem = ({
  label,
  required = false,
  onValueChange,
  value,
  selectItem,
}: MultiSelectFormItemProps) => {
  return (
    <FormItem>
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <MultiSelect
          selectItemList={selectItem}
          selected={value}
          onClick={onValueChange}
        />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

interface SelectFormItemProps<TField extends FieldValues = FieldValues>
  extends SelectProps {
  label?: string;
  required?: boolean;
  onValueChange: (value: string) => void;
  value: string | undefined;
  selectItem: SelectOption[];
}

export const ComboboxFormItem = ({
  label,
  value,
  selectItem,
  required = false,
  onValueChange,
}: SelectFormItemProps) => {
  const [open, setOpen] = useState(false);

  const selectKey = useMemo(() => {
    // console.log("값 : ", value);
    const selectedItem = selectItem.find((i) => {
      // console.log("비교 시작");
      // console.log(i.value.toString() === value);
      // console.log("비교 끝");
      return i.value.toString() === value;
    });
    // console.log("객체 : ", selectedItem);
    return {
      value: selectedItem?.key ?? label,
      hasValue: !!selectedItem,
    };
  }, [value, selectItem, label]);
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
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <FormControl>
            <TriggerButton
              className={`${
                selectKey.hasValue ? "text-black" : "text-[var(--placeholder)]"
              } `}
              onMouseDown={(e) => {
                e.preventDefault(); // 기본 동작 방지
              }}
            >
              {selectKey.value}
            </TriggerButton>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0   bg-white ">
          <Command>
            <CommandInput
              className="h-9 placeholder:text-[var(--placeholder)]"
              placeholder={label}
            />
            <CommandList>
              <CommandEmpty>결과 없음</CommandEmpty>
              <CommandGroup>
                {selectItem.map((item) => (
                  <CommandItem
                    className=" rounded-[4px]
                hover:cursor-pointer hover:hover:bg-[var(--background)]"
                    value={item.key}
                    key={item.key}
                    onSelect={() => {
                      onValueChange(item.value.toString());
                      setOpen(false);
                    }}
                  >
                    {item.key}
                    <Check
                      className={cn(
                        "ml-auto",
                        item.value.toString() === value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};

export default SelectFormItem;

interface SelectColorFormItemProps extends SelectProps {
  label?: string;
  required?: boolean;
  onChange: (value: string) => void;
  value: string | undefined;
}

export const SelectColorFormItem = ({
  label,
  required,
  onChange,
  value,
}: SelectColorFormItemProps) => {
  return (
    <FormItem>
      <div className="flex">
        {label ? (
          <span className="text-xs text-[var(--description-light)]">
            {label}
          </span>
        ) : null}
        {required ? <span className="text-xs text-red-500">*</span> : null}
      </div>
      <FormControl>
        <ColorPicker value={value} onChange={onChange} />
      </FormControl>
      <FormMessage className="text-xs text-red-500" />
    </FormItem>
  );
};
