"use client";
import EquipmentAddForm from "@/components/form/normal/equipment/add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useEquipmentMainStore } from "@/store/normal/equipment/equip-main-store";
import { convertRecordDataToFormData } from "@/utils/convert";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddEquipment } = useEquipmentMainStore();

  const handleSubmit = async (values: any) => {
    const formData = convertRecordDataToFormData(values, true);
    const result = await postAddEquipment(formData);
    result.code !== 200 ? setFormResult(false) : setFormResult(true);
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  const formsConfig = {
    titles: ["기본정보"],
    forms: [<EquipmentAddForm onNext={handleSubmit} />],
  };

  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="장비 생성"
        description="장비정보"
        curStep={curStep}
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
