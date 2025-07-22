import AppTitle from "@/components/common/label/title";
import React from "react";
import UserCard from "../checklist/components/user-card";
import { mockAdminList } from "@/types/admin/user/user-list";

const Page = () => {
  return (
    <>
      <AppTitle title="관리자" />
      <div className="flex flex-col gap-2">
        {mockAdminList.map((w, i) => (
          <UserCard key={i} item={w} />
        ))}
      </div>
    </>
  );
};

export default Page;
