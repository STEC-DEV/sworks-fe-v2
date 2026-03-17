"use client";
import React from "react";

import AppTitle from "@/components/common/label/title";
import ClientPage from "./client-page";
import { Factory } from "lucide-react";

const Page = () => {
  return (
    <>
      <AppTitle title="사업장" />
      <ClientPage />
    </>
  );
};

export default Page;
