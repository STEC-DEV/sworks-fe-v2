"use client";

import EquipmentAddForm from "@/components/form/normal/equipment/add";
import EquipmentHistoryAddForm, {
  HistoryAddType,
} from "@/components/form/normal/equipment/history-add";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useDecodeParam } from "@/hooks/params";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import React, { useState } from "react";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const [formResult, setFormResult] = useState<boolean>(false);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddHistory } = useEquipmentHistoryMainStore();
  const handleSubmit = async (values: HistoryAddType) => {
    const res = await postAddHistory(values);
    res.data ? setFormResult(true) : setFormResult(false);
    setCurStep((prev) => prev + 1);
    setOpen(true);
  };

  const formsConfig = {
    titles: ["기본정보"],
    forms: [<EquipmentHistoryAddForm onNext={handleSubmit} />],
  };
  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="관리이력 생성"
        description="관리이력정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={`/equipment/${rawValue}`}
        failedUrl={`/equipment/${rawValue}`}
      />
    </>
  );
};

export default Page;
