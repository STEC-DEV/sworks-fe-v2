"use client";
import UserTypeSelectForm, {
  UserTypeSelectFormType,
} from "@/components/form/normal/user/add1";
import UserAddForm, {
  UserAddFormType,
} from "@/components/form/normal/user/add2";
import FormLayout from "@/components/layout/form-layout";
import ResultDialog from "@/components/ui/custom/form/result-dialog";
import { useUserMainStore } from "@/store/normal/user/main-store";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [formResult, setFormResult] = useState<boolean>(false);
  const [newSeq, setNewSeq] = useState<number>(-1);
  const [curStep, setCurStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const {
    updateCreateUser,
    resetCreateUser,
    postAddUser,
    getCreateUserClassification,
  } = useUserMainStore();

  useEffect(() => {
    getCreateUserClassification();
    return () => {
      resetCreateUser();
    };
  }, []);

  const handleNext = (values: UserTypeSelectFormType) => {
    updateCreateUser(values);
    setCurStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurStep((prev) => prev - 1);
  };

  const handleSubmit = async (values: UserAddFormType) => {
    updateCreateUser(values);
    const res = await postAddUser();
    setCurStep((prev) => prev + 1);
  };

  const formsConfig = {
    titles: ["사용자유형", "기본정보"],
    forms: [
      <UserTypeSelectForm onNext={handleNext} />,
      <UserAddForm onPrev={handlePrev} onNext={handleSubmit} />,
    ],
  };

  return (
    <>
      <FormLayout
        steps={formsConfig}
        title="사용자 생성"
        description="사용자정보"
        curStep={curStep}
      />
      <ResultDialog
        result={formResult}
        open={open}
        setOpen={setOpen}
        successUrl={newSeq.toString()}
        successSubUrl={"/workplace/user"}
        failedUrl={"/workplace/ user"}
      />
    </>
  );
};

export default Page;
