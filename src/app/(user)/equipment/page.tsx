import AppTitle from "@/components/common/label/title";

import React from "react";
import EquipmentFilter from "./_components/filter";
import EquipmentPagination from "./_components/pagination";
import EquipmentList from "./_components/list";

const Page = () => {
  return (
    <>
      <AppTitle title="장비" />
      <EquipmentFilter />
      <EquipmentPagination />
      <EquipmentList />
    </>
  );
};

export default Page;
