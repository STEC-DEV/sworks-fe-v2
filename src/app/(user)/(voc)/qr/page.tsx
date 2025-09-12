import AppTitle from "@/components/common/label/title";
import React from "react";
import QrFilter from "./_components/filter";
import QrPagination from "./_components/pagination";
import QrList from "./_components/list";

const Page = () => {
  return (
    <>
      <AppTitle title="위치 QR" />
      <QrFilter />
      <QrPagination />
      <QrList />
    </>
  );
};

export default Page;
