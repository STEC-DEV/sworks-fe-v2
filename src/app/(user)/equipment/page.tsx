import AppTitle from "@/components/common/label/title";

import React from "react";
import EquipmentFilter from "./_components/filter";
import EquipmentPagination from "./_components/pagination";
import EquipmentList from "./_components/list";
import { Wrench } from "lucide-react";
import { OptionSectionWrapper } from "@/components/common/option-wrapper";

const Page = () => {
  return (
    <>
      <AppTitle title="장비" />
      <OptionSectionWrapper>
        <EquipmentFilter />
        <EquipmentPagination />
      </OptionSectionWrapper>

      <EquipmentList />
    </>
  );
};

export default Page;
