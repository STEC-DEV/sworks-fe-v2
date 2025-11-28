"use client";
import AppTitle from "@/components/common/label/title";
import React from "react";

import AdminFilter from "./components/user-filter";

import AdminList from "./components/user-list";
import AdminPagination from "./components/user-pagination";
import { Users2 } from "lucide-react";

const Page = () => {
  return (
    <>
      <AppTitle title="관리자" icon={Users2} />
      <AdminFilter />
      <AdminPagination />
      <AdminList />
    </>
  );
};

export default Page;
