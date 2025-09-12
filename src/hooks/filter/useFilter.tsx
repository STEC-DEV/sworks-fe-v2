"use client";
import { FilterConfig } from "@/components/ui/custom/filter.tsx/common-filter";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UseFilterProps {
  filters?: FilterConfig[];
}

/**
 * 옵션 필터
 */
export const useFilter = ({ filters }: UseFilterProps) => {
  const router = useRouter();
  const [filterState, setFilterState] = useState<Record<string, string[]>>(
    () => {
      if (!filters) return {};
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

    if (!filters) return;

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
 * 기간 필터
 */

interface UseDurationFilterProps {
  startName: string;
  endName: string;
}
export const useDurationFilter = ({
  startName,
  endName,
}: UseDurationFilterProps) => {
  const router = useRouter();
  const [duration, setDuration] = useState<Record<string, Date | null>>(() => ({
    [startName]: null,
    [endName]: null,
  }));

  //현재 querystring값 받아서 할당
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const startValue = params.get(startName);
    const endValue = params.get(endName);
    setDuration({
      [startName]: startValue ? new Date(startValue) : null,
      [endName]: endValue ? new Date(endValue) : null,
    });
  }, []);

  //라우팅
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    Object.entries(duration).forEach(([key, value]) => {
      if (value) params.set(key, format(value, "yyyy-MM-dd"));
      else params.delete(key);
    });
    router.push(`?${params.toString()}`);
  }, [duration]);

  /**
   * 날짜 변경 핸들러
   */
  const handleUpdateDuration = (keyName: string, value: Date) => {
    const valueStr = format(value, "yyyy-MM-dd");
    //start값이 변경된 경우
    if (keyName === startName) {
      const currentStartStr = duration[startName]
        ? format(duration[startName], "yyyy-MM-dd")
        : null;

      //동일한값이 들어온다면 취소
      if (currentStartStr === valueStr) {
        setDuration((prev) => ({ ...prev, [startName]: null }));
        return;
      }
      // end값이 존재하며 end값보다 큰값인가
      if (duration[endName] && value > duration[endName]) {
        setDuration((prev) => ({ ...prev, [endName]: value }));
      }

      //기본값변경
      setDuration((prev) => ({ ...prev, [startName]: value }));
    } else {
      const currentEndStr = duration[endName]
        ? format(duration[endName], "yyyy-MM-dd")
        : null;

      //동일한값이 들어온다면 취소
      if (currentEndStr === valueStr) {
        setDuration((prev) => ({ ...prev, [endName]: null }));
        return;
      }
      //end값이 변경된 경우
      if (duration[startName] && value < duration[startName]) {
        setDuration((prev) => ({ ...prev, [startName]: value }));
      }

      //기본값변경
      setDuration((prev) => ({ ...prev, [endName]: value }));
    }
  };

  /**
   * 초기화
   */
  const handleReset = () => {
    setDuration({ [startName]: null, [endName]: null });
  };

  return { duration, handleUpdateDuration, handleReset };
};
