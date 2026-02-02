"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import AppTitle from "@/components/common/label/title";
import ConstructionEditForm from "@/components/form/normal/construction/edit";
import PrevLayout from "@/components/layout/prev-layout";
import { useBuildingStore } from "@/store/normal/building/building";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { construction, getConstruction, patchUpdateArchitecture } =
    useBuildingStore();
  const router = useRouter();
  useEffect(() => {
    getConstruction();
  }, []);

  const handleSubmit = async (values: any) => {
    await patchUpdateArchitecture(values);
    router.push("/workplace");
  };

  return (
    <PrevLayout>
      <div className="xl:w-150 flex flex-col gap-6">
        <AppTitle title="건축물 정보 수정" isBorder />
        {construction ? (
          <ConstructionEditForm data={construction} onSubmit={handleSubmit} />
        ) : (
          <BaseSkeleton />
        )}
      </div>
    </PrevLayout>
  );
};

export default Page;
