"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import ConstructionEditForm from "@/components/form/normal/construction/edit";
import { useBuildingStore } from "@/store/normal/building/building";
import React, { useEffect } from "react";

const Page = () => {
  const { construction, getConstruction } = useBuildingStore();
  useEffect(() => {
    getConstruction();
  }, []);

  const handleSubmit = (values: any) => {
    console.log("============수정============");
    console.log(values);
    console.log("============================");
  };

  return (
    <div className="xl:w-150 flex flex-col gap-6">
      <AppTitle title="건축물 정보 수정" isBorder />
      {construction ? (
        <ConstructionEditForm data={construction} onSubmit={handleSubmit} />
      ) : (
        <BaseSkeleton />
      )}
    </div>
  );
};

export default Page;
