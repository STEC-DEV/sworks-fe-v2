"use client";

import EquipmentHistoryAddForm, {
  HistoryAddType,
} from "@/components/form/normal/equipment/history-add";
import { FormLayout } from "@/components/layout/form/form-layout";
// import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useDecodeParam } from "@/hooks/params";
import { useEquipmentHistoryMainStore } from "@/store/normal/equipment/history/list-store";
import React, { useState } from "react";

const Page = () => {
  const { rawValue } = useDecodeParam("id");
  const [formResult, setFormResult] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddHistory } = useEquipmentHistoryMainStore();

  const handleSubmit = async (values: HistoryAddType) => {
    const res = await postAddHistory(values);
    setFormResult(res.data);

    setOpen(true);
  };

  const formsConfig = {
    titles: ["기본정보"],
    forms: [<EquipmentHistoryAddForm onNext={handleSubmit} key={1} />],
  };
  return (
    <>
      <FormLayout
        title="관리이력 생성"
        steps={[
          {
            label: "관리이력",
            description: "장비 관리이력 정보 입력",
            form: (nav) => <EquipmentHistoryAddForm onNext={handleSubmit} />,
          },
        ]}
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
