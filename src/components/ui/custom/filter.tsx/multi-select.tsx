import Button from "@/components/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import { Check, Filter, FilterIcon, LucideIcon } from "lucide-react";

interface MultiSelectProps<T extends Record<string, string>> {
  placeholder: string;
  icon?: LucideIcon;
  data: T;
  selected: string[];
  onClick: (data: string[]) => void;
}

const MultiSelect = <T extends Record<string, string>>({
  placeholder,
  data,
  selected,
  icon: Icon = Filter,
  onClick,
}: MultiSelectProps<T>) => {
  const handleAllCheck = () => {
    const isSelect = selected.length === Object.keys(data).length;
    //해제
    if (isSelect) {
      onClick([]);
    } else {
      onClick(Object.entries(data).map(([key, value]) => value));
      //전체 셀렉트
    }
  };

  const handleCheck = (value: string) => {
    const isSelect = selected.some((p) => p === value);

    //기존에 존재하면 추가 아니면 삭제
    const newItems = isSelect
      ? selected.filter((p) => p !== value)
      : [...selected, value];
    onClick(newItems);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button
          label={`${placeholder} ${
            selected.length > 0 ? `(${selected.length})` : ""
          }`}
          icon={
            <FilterIcon
              className={`${
                selected.length > 0
                  ? "text-primary font-bold"
                  : "text-description"
              }`}
              size={16}
              strokeWidth={1.5}
            />
          }
          variant={"filter"}
          className={`h-9 font-medium
            border-border-strong shadow-sm  text-nowrap text-sm bg-surface border  hover:bg-gray-50 ${
              selected.length > 0
                ? "text-primary border-primary font-bold"
                : "text-description"
            }
          focus-visible:outline-none focus-visible:ring-0
          `}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-DEFAULT bg-surface">
        <div
          className="flex gap-2 items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 rounded-[4px]"
          onClick={() => handleAllCheck()}
        >
          <span className="text-xs">전체</span>
          {selected.length === Object.keys(data).length ? (
            <Check className="w-4 h-4 text-primary" />
          ) : null}
        </div>
        {Object.entries(data).map(([key, value], i) => {
          return (
            <div
              className="flex gap-2 items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50 rounded-[4px]"
              key={i}
              onClick={() => handleCheck(value)}
            >
              <span className="text-xs">{key}</span>
              {selected.some((i) => i === value) ? (
                <Check className="w-4 h-4 text-primary" />
              ) : null}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MultiSelect;
