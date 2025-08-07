"use client";
import WorkplaceCard from "@/app/admin/workplace/components/workplace-card";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminWorkplacePagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { adminWorkplaceList } = useAdminDetailStore();

  return (
    <>
      {adminWorkplaceList.type === "data" ? (
        <div className="flex gap-4">
          <CommonPagination totalCount={adminWorkplaceList.meta.totalCount} />
          <BaseDialog
            triggerChildren={<IconButton icon={"SquarePen"} />}
            title="담당 사업장 수정"
            open={open}
            setOpen={setOpen}
          >
            <EditAdminWorkplaceContents setOpen={setOpen} />
          </BaseDialog>
        </div>
      ) : null}
    </>
  );
};

export default AdminWorkplacePagination;

/**
 * 담당 사업장 수정 모달
 * @returns
 */
const EditAdminWorkplaceContents = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [search, setSearch] = useState<string>("");
  const { id } = useParams();
  const searchParams = useSearchParams();
  const {
    allWorkplace,
    getAllWorkplace,
    selectedWorkplaceList,
    updateSelectedWorkplaces,
    putAdminWorkplaceList,
    getAdminWorkplaceList,
  } = useAdminDetailStore();

  useEffect(() => {
    if (!id) return;
    getAllWorkplace(id?.toString(), search);
  }, []);

  const handleCheck = (item: any) => {
    updateSelectedWorkplaces(item.siteSeq);
  };
  const handleSubmit = async () => {
    if (!id) return;
    await putAdminWorkplaceList(id?.toString());
    await getAdminWorkplaceList(
      new URLSearchParams(searchParams),
      id.toString()
    );
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
        {allWorkplace ? (
          allWorkplace.map((v, i) => (
            <WorkplaceCard
              key={i}
              item={v}
              checkOption
              isCheck={selectedWorkplaceList.includes(v.siteSeq)}
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
