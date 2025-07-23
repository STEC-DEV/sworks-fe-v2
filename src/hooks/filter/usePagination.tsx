"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface UsePaginationState {
  pageNumber: string;
  pageSize: string;
}

export const usePagination = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageFilter, setPageFilter] = useState<UsePaginationState>({
    pageNumber: searchParams.get("pageNumber") ?? "1",
    pageSize: searchParams.get("pageSize") ?? "20",
  });

  //라우팅 처리 (page 번호)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    params.set("pageNumber", pageFilter.pageNumber);
    router.push(`?${params.toString()}`);
  }, [pageFilter.pageNumber]);

  //라우팅 처리 (view 개수)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    setPageFilter((prev) => ({
      ...prev,
      pageNumber: "1",
    }));
    params.set("pageSize", pageFilter.pageSize);
    router.push(`?${params.toString()}`);
  }, [pageFilter.pageSize]);

  //페이지 번호로 이동
  const handlePage = useCallback((page: number) => {
    setPageFilter((prev) => ({
      ...prev,
      pageNumber: page.toString(),
    }));
  }, []);

  // view 개수
  const handleView = useCallback((size: string) => {
    setPageFilter((prev) => ({
      ...prev,
      pageSize: size,
    }));
  }, []);

  return { pageFilter, handlePage, handleView };
};
