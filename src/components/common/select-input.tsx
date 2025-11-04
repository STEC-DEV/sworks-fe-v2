import { SelectOption } from "@/types/common/select-item";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Check, ChevronDownIcon } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectProps } from "@radix-ui/react-select";

/**
 *
 * @returns
 *
 */

interface MultiSelectProps {
  selectItemList: SelectOption[];
  selected: string[];
  placeholder?: string;
  onClick: (data: string[]) => void;
}

export const MultiSelect = ({
  selectItemList,
  selected,
  placeholder = "요소를 입력하세요",
  onClick,
}: MultiSelectProps) => {
  //all selected handler
  const handleAllCheck = () => {
    const isSelect = selected.length === Object.keys(selectItemList).length;
    //해제
    if (isSelect) {
      onClick([]);
    } else {
      //전체 셀렉트
      const allData = selectItemList.map((s) => s.value.toString());
      onClick(allData);
    }
  };

  //단일선택
  const handleCheck = (value: SelectOption) => {
    console.log("unit select");
    //already include in value case
    if (selected.includes(value.value.toString())) {
      console.log("delete item");
      const newItem = selected.filter((v) => v !== value.value.toString());
      console.log(newItem);
      onClick(newItem);
    } else {
      console.log("add item");

      console.log([...selected, value.value.toString()]);
      onClick([...selected, value.value.toString()]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative border h-9 px-3 py-1 flex items-center rounded-[4px] border-[var(--border)]">
          <div className="flex-1 text-left">
            {selected.length > 0 ? (
              <span className="text-sm">
                {selectItemList
                  .filter((v) => selected.includes(v.value.toString()))
                  .map((v) => v.key)
                  .join(", ")}
              </span>
            ) : (
              <span className="text-[var(--placeholder)] text-sm ">
                {placeholder}
              </span>
            )}
          </div>

          <ChevronDownIcon className="w-4 h-4 text-gray-500 opacity-50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white w-full"
        sideOffset={3}
        align="start"
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <ScrollArea className="max-h-80">
          <div
            className="flex gap-2 items-center justify-between px-4 py-2 hover:cursor-pointer hover:bg-gray-50 rounded-[4px]"
            onClick={() => handleAllCheck()}
          >
            <span className="text-xs">전체</span>
            {selected.length === selectItemList.length ? (
              <Check className="w-4 h-4 text-blue-500" />
            ) : null}
          </div>
          {selectItemList.map((v, i) => {
            return (
              <div
                key={i}
                className="flex gap-2 items-center justify-between px-4 py-2 hover:cursor-pointer hover:bg-gray-50 rounded-[4px]"
                onClick={() => handleCheck(v)}
              >
                <span className="text-xs">{v.key}</span>
                {selected.includes(v.value.toString()) ? (
                  <Check className="w-4 h-4 text-blue-500" />
                ) : null}
              </div>
            );
          })}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface SelectItemProps extends SelectProps {
  value: string | undefined;
  onValueChange: (value: string) => void;
  selectItem: SelectOption[];
}

export const BaseSelect = ({
  value,
  onValueChange,
  selectItem,
}: SelectItemProps) => {
  return (
    <Select onValueChange={(value) => onValueChange(value)} value={value}>
      <SelectTrigger
        className={`w-full text-sm  rounded-[4px] border border-[var(--border)] shadow-none transition duration-300
                      focus-visible:border-[var(--primary)] focus-visible:border-1 focus-visible:ring-1 focus-visible:ring-[var(--primary)]
                      hover:border-[var(--primary)] hover:cursor-pointer
                      data-[placeholder]:text-[var(--placeholder)] data-[state=open]:ring-[var(--primary)] data-[state=open]:border-[var(--primary)] data-[state=open]:ring-1 data-[state=open]:ring-inset
                      `}
      >
        <SelectValue placeholder={"값을 선택해주세요."} />
      </SelectTrigger>
      <SelectContent className="bg-white">
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
  );
};
