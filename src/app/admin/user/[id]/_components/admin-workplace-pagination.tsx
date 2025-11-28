"use client";
import WorkplaceCard from "@/app/admin/workplace/components/workplace-card";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import Input from "@/components/common/input";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { ScrollArea } from "@/components/ui/scroll-area";

import { usePermission } from "@/hooks/usePermission";
import { useAdminDetailStore } from "@/store/admin/admin/admin-detail";
import { useAuthStore } from "@/store/auth/auth-store";
import { useUIStore } from "@/store/common/ui-store";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const AdminWorkplacePagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { admin, adminWorkplaceList, loadingKeys } = useAdminDetailStore();
  const { isLoading, hasError } = useUIStore();
  const { canEdit } = usePermission();
  const { loginProfile } = useAuthStore();

  if (isLoading(loadingKeys.WORKPLACE) || !adminWorkplaceList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.WORKPLACE)) return <div>에러발생</div>;

  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={adminWorkplaceList.meta.totalCount} />
      {(canEdit || admin?.userSeq === loginProfile?.userSeq) && (
        <BaseDialog
          triggerChildren={<IconButton icon={"SquarePen"} size={16} />}
          title="담당 사업장 수정"
          open={open}
          setOpen={setOpen}
        >
          <EditAdminWorkplaceContents setOpen={setOpen} />
        </BaseDialog>
      )}
    </div>
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
    <div className="flex flex-col gap-6 w-full">
      <div className="px-6">
        <Input
          className="w-full"
          placeholder="사업장명"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="overflow-hidden">
        <div className="flex flex-col gap-2 px-6 pb-1">
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
      </ScrollArea>
      <div className="shrink-0 px-6">
        <Button label="저장" onClick={handleSubmit} />
      </div>
    </div>
  );
};
