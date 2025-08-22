import EquipmentAddForm from "@/components/form/normal/equipment/add";
import FormLayout from "@/components/layout/form-layout";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = () => {};

  const formsConfig = {
    titles: ["기본정보"],
    forms: [<div></div>],
  };
  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="관리이력 생성"
        description="관리이력정보"
        curStep={curStep}
      />
    </>
  );
};

export default Page;
