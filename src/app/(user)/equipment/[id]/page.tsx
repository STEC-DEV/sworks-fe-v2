import React from "react";
import EquipmentInfoCard from "./_components/info";
import EquipmentHistory from "./_components/history";
import AppTitle from "@/components/common/label/title";

const Page = () => {
  return (
    <>
      <AppTitle title="장비" isPrev />
      <EquipmentInfoCard />
      <EquipmentHistory />
    </>
  );
};

export default Page;
