import AppTitle from "@/components/common/label/title";
import NoticeAddForm from "@/components/form/normal/notice/add";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col gap-6">
      <AppTitle title="공지사항 생성" isBorder />
      <NoticeAddForm />
    </div>
  );
};

export default Page;
