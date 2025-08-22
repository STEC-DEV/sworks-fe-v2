import AppTitle from "@/components/common/label/title";
import React from "react";
import UserFilter from "./filter";
import UserPagination from "./pagination";
import UserList from "./list";

const User = () => {
  return (
    <>
      <AppTitle title="근무자" />
      <UserFilter />
      <UserPagination />
      <UserList />
    </>
  );
};

export default User;
