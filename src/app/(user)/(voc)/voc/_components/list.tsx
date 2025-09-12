import BaseSkeleton from "@/components/common/base-skeleton";
import DataTable from "@/components/common/data-table";
import { useVocStore } from "@/store/normal/voc/voc-store";
import React from "react";
import { vocListCol } from "./voc-columns";

const VocList = () => {
  const { vocList } = useVocStore();

  if (vocList.type === "loading") return <BaseSkeleton />;
  if (vocList.type === "error") return;
  return (
    <DataTable
      columns={vocListCol}
      data={vocList.payload.data}
      idName="logSeq"
      baseUrl="voc"
    />
  );
};

export default VocList;
