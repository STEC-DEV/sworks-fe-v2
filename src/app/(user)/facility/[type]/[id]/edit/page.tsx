"use client";
import AppTitle from "@/components/common/label/title";
import FacilityDetailEditForm from "@/components/form/normal/facility/edit";
import { useDecodeParam } from "@/hooks/params";
import React from "react";

const Page = () => {
  const { decodeValue: title } = useDecodeParam("type");
  return (
    <>
      <AppTitle title={`${title} 이력 수정`} />
      <FacilityDetailEditForm />
    </>
  );
};

export default Page;
