"use client";
import WorkplaceAddForm, {
  basicFormType,
} from "@/components/form/admin/workplace-add";
import { FormLayout } from "@/components/layout/form/form-layout";

import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useWorkplaceListStore } from "@/store/admin/workplace/workplace-list-store";
import React, { useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);

  const [open, setOpen] = useState<boolean>(false);
  const { postAddWorkplace } = useWorkplaceListStore();

  const handleNext = async (values: basicFormType) => {
    const result = await postAddWorkplace(values);
    result.code !== 200 ? setFormResult(false) : setFormResult(true);
    setNewSeq(result.data);

    setOpen(true);
  };

  const mockForm = {
    titles: ["기본정보"],
    forms: [<WorkplaceAddForm onNext={handleNext} />],
  };

  return (
    <>
      <FormLayout
        steps={[
          {
            label: "기본정보",
            description: "사업장 기본정보 입력",
            form: (nav) => <WorkplaceAddForm onNext={handleNext} />,
          },
        ]}
        title="사업장 생성"
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={newSeq.toString()}
        successSubUrl="/admin/workplace"
        failedUrl="/admin/workplace"
      />
    </>
  );
};

export default Page;
