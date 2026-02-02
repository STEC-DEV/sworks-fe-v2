"use client";
import AppTitle from "@/components/common/label/title";
import BuildingEditForm from "@/components/form/normal/building/edit1";
import FacilityEditForm from "@/components/form/normal/building/edit2";
import FireEditForm from "@/components/form/normal/building/edit3";
import PrevLayout from "@/components/layout/prev-layout";
import { useDecodeParam } from "@/hooks/params";
import { useBuildingDetailStore } from "@/store/normal/building/detail";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const { decodeValue: section } = useDecodeParam("section");
  const { building, patchEditBuildingDetail } = useBuildingDetailStore();
  const router = useRouter();
  const title = () => {
    switch (section) {
      case "BUILDING":
        return "건물정보";
      case "FACILITY":
        return "설비정보";
      case "FIRE":
        return "소방정보";
      default:
        return "";
    }
  };
  const forms = () => {
    switch (section) {
      case "BUILDING":
        return <BuildingEditForm onSubmit={handleSubmit} />;
      case "FACILITY":
        return <FacilityEditForm onSubmit={handleSubmit} />;
      case "FIRE":
        return <FireEditForm onSubmit={handleSubmit} />;
      default:
        return "";
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    console.log(values);
    await patchEditBuildingDetail(values);
    moveHome();
  };

  const moveHome = () => {
    router.push(`/workplace/building/${building?.dongSeq}`);
  };

  useEffect(() => {
    console.log(section);
  }, [section]);
  return (
    <PrevLayout>
      <div className="flex flex-col gap-6">
        <AppTitle title={`${title()} 수정`} />
        {forms()}
      </div>
    </PrevLayout>
  );
};

export default Page;
