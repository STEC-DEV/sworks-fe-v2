import React from "react";
import InfoCard from "./_components/info-card";

import DataInfo from "./_components/dashboard/data-info";
import ContractWrapper from "./_components/contract/contract-info";
import ChecklistWrapper from "./_components/checklist/checklist-info";
import ManagerList from "./_components/manager-list/manager-list";
import AppTitle from "@/components/common/label/title";

const Page = () => {
  return (
    <>
      <AppTitle title="사업장 정보" isPrev prevPath="/admin/workplace" />
      <InfoCard />
      {/* <DataInfo /> */}
      <ContractWrapper />
      <ChecklistWrapper />
      <ManagerList />
    </>
  );
};

export default Page;
