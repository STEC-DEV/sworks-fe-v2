import AppTitle from "@/components/common/label/title";
import React, { Suspense } from "react";
import QrFilter from "./_components/filter";
import QrPagination from "./_components/pagination";
import QrList from "./_components/list";
import { QrCode } from "lucide-react";
import { OptionSectionWrapper } from "@/components/common/option-wrapper";

const Page = () => {
  return (
    <>
      <AppTitle title="위치 QR" />
      <OptionSectionWrapper>
        <QrFilter />
        <QrPagination />
      </OptionSectionWrapper>

      <QrList />
    </>
  );
};

export default Page;
