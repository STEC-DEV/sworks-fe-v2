import AppTitle from "@/components/common/label/title";
import React, { Suspense } from "react";
import QrFilter from "./_components/filter";
import QrPagination from "./_components/pagination";
import QrList from "./_components/list";
import { QrCode } from "lucide-react";

const Page = () => {
  return (
    <>
      <AppTitle title="위치 QR" icon={QrCode} />
      <QrFilter />
      <QrPagination />
      <QrList />
    </>
  );
};

export default Page;
