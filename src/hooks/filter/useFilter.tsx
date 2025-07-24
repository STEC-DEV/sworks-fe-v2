"use client";
import { FilterConfig } from "@/components/ui/custom/filter.tsx/common-filter";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseFilterProps {
  filters: FilterConfig[];
}

/**
 * 옵션 필터
 */
export const useFilter = ({ filters }: UseFilterProps) => {
  const router = useRouter();
  const [filterState, setFilterState] = useState<Record<string, string[]>>(
    () => {
      return filters.reduce((acc, filter) => {
        acc[filter.key] = [];
        return acc;
      }, {} as Record<string, string[]>);
    }
  );

  /**
   * url값 받아와서 할당
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const restored: Record<string, string[]> = {};

    filters.forEach((filter) => {
      restored[filter.key] = params.getAll(filter.key);
    });

    setFilterState(restored);
  }, [filters]);

  /**
   * 라우팅 처리
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    Object.entries(filterState).forEach(([key, array]) => {
      params.delete(key);
      array.forEach((item) => {
        params.append(key, item);
      });
    });
    router.push(`?${params.toString()}`);
  }, [router, filterState]);

  const updateFilter = useCallback((key: string, values: string[]) => {
    setFilterState((prev) => ({
      ...prev,
      [key]: values,
    }));
  }, []);

  return {
    filterState,
    updateFilter,
  };
};

/**
 * 검색 상태 관리 hook
 *
 */
export const useSearch = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState<string>("");

  /**
   * url 기존 검색 값 할당
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const search = params.get("searchKey");
    if (!search) return;
    setSearchValue(search);
  }, [router]);

  //검색어 초기화
  const clearSearch = useCallback(() => {
    setSearchValue("");
  }, []);

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      onEnter?: (searchValue: string) => void
    ) => {
      if (e.key === "Enter") {
        onEnter?.(searchValue);
      } else if (e.key === "Escape") {
        clearSearch();
      }
    },
    [searchValue]
  );

  return {
    searchValue,
    setSearchValue,
    clearSearch,
    handleKeyDown,
  };
};

/**
 * 검색 액션 관리 hook
 */
export const useSearchExecution = () => {
  const router = useRouter();

  const executeSearch = useCallback(
    (
      searchValue: string,
      additionalParams?: Record<string, string | string[]>
    ) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);

      params.set("searchKey", searchValue.trim());
      router.push(`?${params.toString()}`);
    },
    [router]
  );
  return { executeSearch };
};

/**
 * 페이지필터
 *
 */
