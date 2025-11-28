"use client";
import Input from "@/components/common/input";
import {
  useDurationFilter,
  useFilter,
  useSearch,
  useSearchExecution,
} from "@/hooks/filter/useFilter";
import { LucideIcon } from "lucide-react";
import React from "react";
import MultiSelect from "./multi-select";
import DurationItem from "./duration-item";

export interface FilterConfig {
  key: string;
  placeholder: string;
  data: Record<string, string>;
  icon?: LucideIcon;
}

interface CommonFilterProps {
  filters?: FilterConfig[];
  search?: boolean;
  startName?: string;
  endName?: string;
}

const CommonFilter = ({
  filters,
  search = true,
  startName,
  endName,
}: CommonFilterProps) => {
  const { filterState, updateFilter } = useFilter({ filters });
  const { searchValue, setSearchValue, clearSearch, handleKeyDown } =
    useSearch();
  const { duration, handleUpdateDuration, handleReset } = useDurationFilter({
    startName: startName ?? "",
    endName: endName ?? "",
  });

  const { executeSearch } = useSearchExecution();

  //엔터키 검색 실행
  const handleSearchEnter = (searchValue: string) => {
    executeSearch(searchValue);
  };

  return (
    <div
      className={`flex flex-col gap-4 xl:flex-row justify-between border-y-2 border-[var(--border)] py-4 ${
        !search ? "justify-end" : ""
      }`}
    >
      {search ? (
        <Input
          placeholder="검색"
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, handleSearchEnter)}
          value={searchValue}
        />
      ) : null}
      {((filters && filters.length > 0) || (startName && endName)) && (
        <div className="flex flex-wrap gap-4">
          {filters?.map((f, i) => (
            <div key={i} className="shrink-0">
              <MultiSelect
                placeholder={f.placeholder}
                icon={f.icon}
                data={f.data}
                selected={filterState[f.key] || []}
                onClick={(data) => {
                  updateFilter(f.key, data);
                }}
              />
            </div>
          ))}

          {startName && endName && (
            <div className="shrink-0">
              <DurationItem
                value={duration}
                startName={startName}
                endName={endName}
                onClick={(date, keyName) => handleUpdateDuration(keyName, date)}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommonFilter;
