import AppTitle from "@/components/common/label/title";
import React from "react";
import UserFilter from "./filter";
import UserPagination from "./pagination";
import UserList from "./list";

const User = () => {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <AppTitle title="근무자" />
      <UserFilter />
      <UserPagination />
      <UserList />
    </div>
  );
};

export default User;
