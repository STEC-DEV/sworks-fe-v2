"use client";
import RnMAddForm from "@/components/form/normal/facility/add";
import { FormLayout } from "@/components/layout/form/form-layout";

import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useDecodeParam } from "@/hooks/params";
import { useFacilityMainStore } from "@/store/normal/facility/facility-main-store";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { postAddFacility } = useFacilityMainStore();
  const { decodeValue } = useDecodeParam("type");
  const handleSubmit = async (values: any) => {
    const result = await postAddFacility(values);
    result.code !== 200 ? setFormResult(false) : setFormResult(true);

    setOpen(true);
  };
  const formsConfig = {
    titles: ["기본정보"],
    forms: [<RnMAddForm onNext={handleSubmit} />],
  };
  return (
    <>
      <FormLayout
        title={`${decodeValue} 생성`}
        steps={[
          {
            label: "기본정보",
            description: `${decodeValue} 정보 입력`,
            form: (nav) => <RnMAddForm onNext={handleSubmit} />,
          },
        ]}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={`/facility/${decodeValue.toLowerCase()}`}
        failedUrl={`/facility/${decodeValue.toLowerCase()}`}
      />
    </>
  );
};

export default Page;
