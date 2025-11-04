"use client";

import { PageActionState, PageActionUnionType } from "@/types/pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

const Pagination = ({
  //현재페이지 nubmer
  activePage,
  //전체 항목 개수
  totalItemCount,
  //보여줄 리스트 수
  viewSize,
  //보여줄페이지수
  pageRangeDisplayed,
  onChange,
}: //페이지 변경 핸들러
// onChange,
{
  activePage: number;
  totalItemCount: number;
  viewSize: number;
  pageRangeDisplayed: number;
  onChange: (page: number) => void;
}) => {
  const searchParams = useSearchParams();
  //현재 url 정보
  const queryParams = new URLSearchParams(searchParams.toString());
  //라우터
  const router = useRouter();
  //pageRange기준 전체 페이지
  const allDisplayedPage = Math.ceil(totalItemCount / viewSize);

  const startPage =
    Math.floor((activePage - 1) / pageRangeDisplayed) * pageRangeDisplayed + 1;

  const endPage =
    Math.min(startPage + pageRangeDisplayed - 1, allDisplayedPage) === 0
      ? 1
      : Math.min(startPage + pageRangeDisplayed - 1, allDisplayedPage);

  // useEffect(() => {
  //   console.log(startPage);
  //   console.log(endPage);
  // }, [startPage, endPage]);

  const pageHandler = ({ pageNumber }: { pageNumber: number }) => {
    //데이터조회
    onChange(pageNumber);
    //URL 이동

    // queryParams.set("pageNumber", pageNumber.toString());
    // router.push(`?${queryParams.toString()}`);
  };

  /**
   *
   */
  const onPageHandle = (value: PageActionUnionType) => {
    // console.log(value);
    switch (value) {
      case PageActionState.FirstPage:
        pageHandler({ pageNumber: startPage });
        break;
      case PageActionState.PrevPage:
        if (activePage - 1 != 0) pageHandler({ pageNumber: activePage - 1 });
        else pageHandler({ pageNumber: 1 });
        break;
      case PageActionState.NextPage:
        if (activePage + 1 <= endPage) {
          pageHandler({ pageNumber: activePage + 1 });
          break;
        } else {
          pageHandler({ pageNumber: endPage });
          break;
        }

      case PageActionState.LastPage:
        pageHandler({ pageNumber: endPage });
        break;
    }
  };

  return (
    <Suspense>
      <div className="flex gap-2">
        <PageActionButton
          icon={ChevronsLeft}
          onClick={() => onPageHandle(PageActionState.FirstPage)}
        />
        <PageActionButton
          icon={ChevronLeft}
          onClick={() => onPageHandle(PageActionState.PrevPage)}
        />
        {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
          const pageNum = startPage + idx;
          const isActive = activePage === pageNum;
          return (
            <PageItemButton
              key={pageNum}
              page={pageNum}
              isActive={isActive}
              onClick={() => pageHandler({ pageNumber: pageNum })}
            />
          );
        })}
        <PageActionButton
          icon={ChevronRight}
          onClick={() => onPageHandle(PageActionState.NextPage)}
        />
        <PageActionButton
          icon={ChevronsRight}
          onClick={() => onPageHandle(PageActionState.LastPage)}
        />
      </div>
    </Suspense>
  );
};

const PageItemButton = ({
  page,
  isActive,
  onClick,
}: {
  page: number;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`border border-[var(--border)] text-xs px-2 py-2 rounded-[4px] w-9 h-9 flex items-center justify-center hover:bg-background cursor-pointer  ${
        isActive ? "bg-[var(--background)] font-bold" : "bg-white"
      }`}
      onClick={onClick}
    >
      {page}
    </div>
  );
};

const PageActionButton = ({
  icon: Icon,
  onClick,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick: () => void;
}) => {
  return (
    <div
      className="border border-[var(--border)] px-2 py-2 rounded-[4px] w-9 h-9 flex items-center justify-center hover:bg-accent cursor-pointer bg-white"
      onClick={onClick}
    >
      <Icon className="w-4" />
    </div>
  );
};

export default Pagination;
