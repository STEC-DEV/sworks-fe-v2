import AppTitle from "@/components/common/label/title";

import React from "react";
import EquipmentFilter from "./_components/filter";
import EquipmentPagination from "./_components/pagination";
import EquipmentList from "./_components/list";
import { Wrench } from "lucide-react";

const Page = () => {
  return (
    <>
      <AppTitle title="장비" icon={Wrench} />
      <EquipmentFilter />
      <EquipmentPagination />
      <EquipmentList />
    </>
  );
};

export default Page;
