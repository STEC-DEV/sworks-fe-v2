import React from "react";
import InfoCard from "./_components/info-card";
import { WorkplaceDetail } from "@/types/admin/workplace/workplace-detail";
import DataInfo from "./_components/dashboard/data-info";
import ContractWrapper from "./_components/contract/contract-info";
import ChecklistInfoArea from "./_components/checklist/checklist-info";
import ManagerList from "./_components/manager-list/manager-list";

const mockData: WorkplaceDetail = {
  siteSeq: 11,
  serviceTypeSeq: 35,
  serviceTypeName: "빌딩",
  siteName: "테스트사업장3",
  siteTel: "0215184451",
  siteAddress: "서울특별시 강남구 테스트사업장3",
};
const Page = () => {
  return (
    <>
      <InfoCard data={mockData} />
      <DataInfo />
      <ContractWrapper />
      <ChecklistInfoArea />
      <ManagerList />
    </>
  );
};

export default Page;
