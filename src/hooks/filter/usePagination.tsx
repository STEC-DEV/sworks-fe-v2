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

  // //라우팅 처리 (page 번호)
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const params = new URLSearchParams(window.location.search);

  //   params.set("pageNumber", pageFilter.pageNumber);
  //   router.push(`?${params.toString()}`);
  // }, [pageFilter.pageNumber]);

  // //라우팅 처리 (view 개수)
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const params = new URLSearchParams(window.location.search);

  //   setPageFilter((prev) => ({
  //     ...prev,
  //     pageNumber: "1",
  //   }));
  //   params.set("pageSize", pageFilter.pageSize);

  //   router.push(`?${params.toString()}`);
  // }, [pageFilter.pageSize]);

  const updateURL = useCallback(
    (updates: Partial<UsePaginationState>) => {
      if (typeof window === "undefined") return;
      const params = new URLSearchParams(window.location.search);

      if (updates.pageNumber) {
        params.set("pageNumber", updates.pageNumber);
      }
      if (updates.pageSize) {
        params.set("pageSize", updates.pageSize);
        params.set("pageNumber", "1"); // pageSize 변경 시에만 1로 리셋
      }

      router.push(`?${params.toString()}`);
    },
    [router]
  );

  // //페이지 번호로 이동
  // const handlePage = useCallback((page: number) => {
  //   setPageFilter((prev) => ({
  //     ...prev,
  //     pageNumber: page.toString(),
  //   }));
  // }, []);

  // // view 개수
  // const handleView = useCallback((size: string) => {
  //   setPageFilter((prev) => ({
  //     ...prev,
  //     pageSize: size,
  //   }));
  // }, []);

  //페이지 번호로 이동
  const handlePage = useCallback(
    (page: number) => {
      const newPageNumber = page.toString();
      setPageFilter((prev) => ({
        ...prev,
        pageNumber: newPageNumber,
      }));
      updateURL({ pageNumber: newPageNumber });
    },
    [updateURL]
  );

  // view 개수
  const handleView = useCallback(
    (size: string) => {
      setPageFilter({
        pageNumber: "1",
        pageSize: size,
      });
      updateURL({ pageSize: size });
    },
    [updateURL]
  );

  return { pageFilter, handlePage, handleView };
};
