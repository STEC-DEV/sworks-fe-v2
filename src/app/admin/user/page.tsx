import AppTitle from "@/components/common/label/title";
import React from "react";
import UserCard from "./components/user-card";
import { mockAdminList } from "@/types/admin/user/user-list";
import AdminFilter from "./components/user-filter";
import WorkplacePagination from "../workplace/components/workplace-pagination";

const Page = () => {
  return (
    <>
      <AppTitle title="관리자" />
      <AdminFilter />
      <WorkplacePagination />
      <div className="flex flex-col gap-2">
        {mockAdminList.map((w, i) => (
          <UserCard key={i} item={w} />
        ))}
      </div>
    </>
  );
};

export default Page;
