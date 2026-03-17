"use client";
import EquipmentAddForm from "@/components/form/normal/equipment/add";
import { FormLayout } from "@/components/layout/form/form-layout";
// import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { convertRecordDataToFormData } from "@/utils/convert";
import React, { useState } from "react";

const Page = () => {
  // const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const [formResult, setFormResult] = useState<boolean>(false);
  const { postAddEquipment } = useEquipmentMainStore();

  const handleSubmit = async (values: any) => {
    const formData = convertRecordDataToFormData(values, true);
    const result = await postAddEquipment(formData);
    setFormResult(result.code === 200);
    // setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  // const formsConfig = {
  //   titles: ["기본정보"],
  //   forms: [<EquipmentAddForm onNext={handleSubmit} key={1} />],
  // };

  return (
    <>
      <FormLayout
        title="장비 생성"
        steps={[
          {
            label: "장비 생성",
            description: "사업장 장비정보 등록",
            form: (nav) => <EquipmentAddForm onNext={handleSubmit} />,
          },
        ]}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={`/equipment`}
        failedUrl={`/equipment`}
      />
    </>
  );
};

export default Page;
