"use client";
import AdminCardWrapper from "@/app/admin/user/components/user-card";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { useWorkplaceDetailStore } from "@/store/admin/workplace/workplace-detail-store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ManagerPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { managers } = useWorkplaceDetailStore();
  return (
    <>
      {managers.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={managers.meta.totalCount} />
          <BaseDialog
            triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
            title="담당 사업장 수정"
            open={open}
            setOpen={setOpen}
          >
            <EditManagerContents setOpen={setOpen} />
          </BaseDialog>
        </div>
      ) : null}
    </>
  );
};

export default ManagerPagination;

/**
 * 담당 관리자 수정 모달
 * @returns
 */
const EditManagerContents = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [search, setSearch] = useState<string>("");
  const { id } = useParams();
  const searchParams = useSearchParams();
  const {
    getAllManagerList,
    allManagerList,
    selectedManagerList,
    updateSelectedManagerList,
    getManagers,
    putManagerList,
  } = useWorkplaceDetailStore();

  useEffect(() => {
    if (!id) return;
    getAllManagerList(id?.toString(), search);
  }, []);

  const handleCheck = (item: any) => {
    updateSelectedManagerList(item.userSeq);
  };
  const handleSubmit = async () => {
    if (!id) return;
    await putManagerList(id?.toString());
    await getManagers(new URLSearchParams(searchParams));
    setOpen(false);
  };
  return (
    <div className="flex flex-col gap-6 ">
      <Input
        className="w-full"
        placeholder="사업장명"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex flex-col gap-2 h-120 overflow-auto">
        {allManagerList ? (
          allManagerList.map((v, i) => (
            <AdminCardWrapper
              key={i}
              item={v}
              checkOption
              isCheck={selectedManagerList.includes(v.userSeq)}
              onClick={handleCheck}
            />
          ))
        ) : (
          <BaseSkeleton />
        )}
      </div>
      <Button label="저장" onClick={handleSubmit} />
    </div>
  );
};
