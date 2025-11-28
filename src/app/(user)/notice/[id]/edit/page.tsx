import AppTitle from "@/components/common/label/title";

import NoticeEditForm from "@/components/form/normal/notice/edit";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col gap-6">
      <AppTitle title="공지사항 수정" isBorder />
      <NoticeEditForm />
    </div>
  );
};

export default Page;
