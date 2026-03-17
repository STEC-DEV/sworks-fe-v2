import AppTitle from "@/components/common/label/title";
import React from "react";
import UserFilter from "./filter";
import UserPagination from "./pagination";
import UserList from "./list";
import { Users2 } from "lucide-react";
import { OptionSectionWrapper } from "@/components/common/option-wrapper";

const User = () => {
  return (
    <div className="flex-1 flex flex-col gap-6 h-full ">
      <AppTitle title="근무자" />
      <OptionSectionWrapper>
        <UserFilter />
        <UserPagination />
      </OptionSectionWrapper>
      <UserList />
    </div>
  );
};

export default User;
