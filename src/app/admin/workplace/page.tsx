import { mockWorkplaceList } from "@/types/admin/workplace/workplace-list";
import React from "react";
import WorkplaceCard from "./components/workplace-card";
import AppTitle from "@/components/common/label/title";

const Page = () => {
  return (
    <>
      <AppTitle title="사업장" />
      <div className="flex flex-col gap-2">
        {mockWorkplaceList.map((w, i) => (
          <WorkplaceCard key={i} item={w} />
        ))}
      </div>
    </>
  );
};

export default Page;
