"use client";
import Input from "@/components/common/input";
import {
  useFilter,
  useSearch,
  useSearchExecution,
} from "@/hooks/filter/useFilter";
import { LucideIcon } from "lucide-react";
import React from "react";
import MultiSelect from "./multi-select";
import { useSearchParams } from "next/navigation";

export interface FilterConfig {
  key: string;
  placeholder: string;
  data: Record<string, string>;
  icon?: LucideIcon;
}

interface CommonFilterProps {
  filters: FilterConfig[];
}

const CommonFilter = ({ filters }: CommonFilterProps) => {
  const searchParams = useSearchParams();
  const { filterState, updateFilter } = useFilter({ filters });
  const { searchValue, setSearchValue, clearSearch, handleKeyDown } =
    useSearch();

  const { executeSearch } = useSearchExecution();

  //엔터키 검색 실행
  const handleSearchEnter = (searchValue: string) => {
    executeSearch(searchValue);
  };

  return (
    <div className="flex justify-between border-y border-[var(--border)] py-4 ">
      <Input
        placeholder="검색"
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e, handleSearchEnter)}
        value={searchValue}
      />
      <div className="flex gap-4">
        {filters.map((f, i) => (
          <MultiSelect
            key={i}
            placeholder={f.placeholder}
            icon={f.icon}
            data={f.data}
            selected={filterState[f.key]}
            onClick={(data) => {
              updateFilter(f.key, data);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CommonFilter;
