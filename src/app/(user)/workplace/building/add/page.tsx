"use client";
import BuildingAddForm from "@/components/form/normal/building/add1";
import FacilityAddForm from "@/components/form/normal/building/add2";
import FireAddForm from "@/components/form/normal/building/add3";
// import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useBuildingStore } from "@/store/normal/building/building";
import React, { useEffect, useState } from "react";
import { FormLayout } from "@/components/layout/form/form-layout";

const Page = () => {
  // const [formResult, setFormResult] = useState<boolean>(false);
  // const [curStep, setCurStep] = useState<number>(1);
  // const [open, setOpen] = useState<boolean>(false);
  // const {
  //   construction,
  //   setCreateBuilding,
  //   resetCreateBuilding,
  //   postAddBuilding,
  //   getConstruction,
  // } = useBuildingStore();
  // useEffect(() => {
  //   getConstruction();
  //   return () => {
  //     resetCreateBuilding();
  //   };
  // }, [getConstruction, resetCreateBuilding]);

  // const handleBuildingNext = (values: Record<string, any>) => {
  //   setCreateBuilding(values);
  //   nextPage();
  // };

  // const handleFacilityNext = (values: Record<string, any>) => {
  //   setCreateBuilding(values);
  //   nextPage();
  // };

  // const handleSubmit = async (values: Record<string, any>) => {
  //   if (!construction) return;
  //   const updateData = { ...values, buildingSeq: construction.buildingSeq };
  //   setCreateBuilding(updateData);
  //   const res = await postAddBuilding();
  //   setFormResult(res.data);
  //   nextPage();
  //   setOpen(true);
  // };

  // const nextPage = () => {
  //   setCurStep((prev) => prev + 1);
  // };

  // const prevPage = () => {
  //   setCurStep((prev) => prev - 1);
  // };

  // const formsConfig = {
  //   titles: ["건물정보", "설비정보", "소방정보"],
  //   forms: [
  //     <BuildingAddForm onNext={handleBuildingNext} />,
  //     <FacilityAddForm onPrev={prevPage} onNext={handleFacilityNext} />,
  //     <FireAddForm onPrev={prevPage} onNext={handleSubmit} />,
  //   ],
  //}
  const [open, setOpen] = useState<boolean>(false);
  const [formResult, setFormResult] = useState<boolean>(false);
  const {
    construction,
    setCreateBuilding,
    resetCreateBuilding,
    postAddBuilding,
    getConstruction,
  } = useBuildingStore();

  useEffect(() => {
    getConstruction();
    return () => resetCreateBuilding();
  }, [getConstruction, resetCreateBuilding]);

  const handleSubmit = async (values: Record<string, any>) => {
    if (!construction) return;
    setCreateBuilding({ ...values, buildingSeq: construction.buildingSeq });
    const res = await postAddBuilding();
    setFormResult(res.data);
    setOpen(true);
  };

  return (
    <>
      <FormLayout
        title="건물 생성"
        steps={[
          {
            label: "건물정보",
            description: "기본정보 입력",
            form: (nav) => (
              <BuildingAddForm
                onNext={(values) => {
                  setCreateBuilding(values);
                  nav.next();
                }}
              />
            ),
          },
          {
            label: "설비정보",
            description: "엘리베이터, 전기 등",
            form: (nav) => (
              <FacilityAddForm
                onPrev={nav.prev}
                onNext={(values) => {
                  setCreateBuilding(values);
                  nav.next();
                }}
              />
            ),
          },
          {
            label: "소방정보",
            description: "소화설비, 펌프 등",
            form: (nav) => (
              <FireAddForm onPrev={nav.prev} onNext={handleSubmit} />
            ),
          },
        ]}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl="/workplace"
        failedUrl="/workplace"
      />
      {/* <FormLayout
        steps={formsConfig}
        title="건물 생성"
        description="건물정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={"/workplace"}
        failedUrl="/workplace"
      /> */}
    </>
  );
};

export default Page;
