"use client";
import AppTitle from "@/components/common/label/title";
import { useUIStore } from "@/store/common/ui-store";
import { useNoticeStore } from "@/store/normal/notice/notice-store";
import { AudioLines } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import NoticeFilter from "./_components/filter";
import NoticePagination from "./_components/pagination";
import NoticeList from "./_components/list";

const Page = () => {
  const { getNotice } = useNoticeStore();

  const searchParams = useSearchParams();

  useEffect(() => {
    getNotice(new URLSearchParams(searchParams));
  }, [searchParams]);

  return (
    <>
      <AppTitle title="공지사항" icon={AudioLines} />
      <NoticeFilter />
      <NoticePagination />
      <NoticeList />
    </>
  );
};

export default Page;
