import AppTitle from "@/components/common/label/title";
import React from "react";
import ClientPage from "./client-page";
import { ListChecks } from "lucide-react";

const Page = () => {
  return (
    <>
      <AppTitle title="체크리스트" icon={ListChecks} />
      <ClientPage />
    </>
  );
};

export default Page;
