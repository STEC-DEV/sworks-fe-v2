import React, { Suspense } from "react";
import User from "./_components/_user/user";
import Building from "./_components/construction/item";

const Page = () => {
  return (
    <div className="flex flex-col gap-12">
      <Building />
      <User />
    </div>
  );
};

export default Page;
