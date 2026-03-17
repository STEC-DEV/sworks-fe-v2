"use client";
import AdminCardWrapper from "@/app/admin/user/components/user-card";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import Input, { InputSearch } from "@/components/common/input";
import BaseDialog from "@/components/ui/custom/base-dialog";
import EmptyBox from "@/components/ui/custom/empty";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { useWorkplaceManagerStore } from "@/store/admin/workplace/manager-store";

import { useUIStore } from "@/store/common/ui-store";
import { AdminListItem, SelectAdminList } from "@/types/admin/admin/user-list";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ManagerPagination = () => {
  const { canEdit } = usePermission();
  const [open, setOpen] = useState<boolean>(false);
  const { managers, loadingKeys } = useWorkplaceManagerStore();
  const { isLoading, hasError } = useUIStore();
  if (isLoading(loadingKeys.MANAGER) || !managers)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.MANAGER)) return <div>에러 발생</div>;
  return (
    <div className="flex gap-4 items-center">
      <CommonPagination totalCount={managers.meta.totalCount} />
      {canEdit && (
        <BaseDialog
          triggerChildren={
            <IconButton
              icon={"SquarePen"}
              size={16}
              bgClassName="!rounded-DEFAULT border border-border-strong shadow-sm hover:bg-primary-background"
            />
          }
          title="담당 사업장 수정"
          open={open}
          setOpen={setOpen}
        >
          <EditManagerContents setOpen={setOpen} />
        </BaseDialog>
      )}
    </div>
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
  const [select, setSelect] = useState<SelectAdminList[]>([]);
  const { rawValue: id } = useDecodeParam("id");
  const searchParams = useSearchParams();
  const { getAllManagerList, allManagerList, getManagers, putManagerList } =
    useWorkplaceManagerStore();

  //담당관리자 조회
  useEffect(() => {
    if (!id) return;
    getAllManagerList(id?.toString(), search);
  }, []);

  useEffect(() => {
    if (!allManagerList) return;
    setSelect(allManagerList.filter((v) => v.isAdminSite === true));
  }, [allManagerList]);

  // ✨ 추가: 검색 필터링 로직
  const filteredManagers = allManagerList?.filter((manager) => {
    const searchLower = search.toLowerCase().trim();
    if (!searchLower) return true;

    return manager.userName.toLowerCase().includes(searchLower);
  });

  const handleCheck = (item: AdminListItem) => {
    setSelect((prev) => {
      const exist = prev.find((v) => v.userSeq === item.userSeq);

      return exist
        ? prev.filter((v) => v.userSeq !== item.userSeq)
        : [
            ...prev,
            {
              ...item,
              isAdminSite: true,
            } as SelectAdminList,
          ];
    });
  };

  const handleSubmit = async () => {
    if (!id) return;
    await putManagerList(
      id?.toString(),
      select.map((v) => v.userSeq),
    );
    setOpen(false);
    await getManagers(id, new URLSearchParams(searchParams));
  };

  return (
    <div className="flex flex-col gap-6 w-full ">
      <div className="px-6 shrink-0">
        <InputSearch
          className="w-full"
          placeholder="이름, 전화번호, 부서명, 직책 검색" // 🔄 수정: placeholder 변경
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="overflow-hidden px-6 h-[90vh]">
        <div className="flex flex-col gap-2 pb-1">
          {/* 🔄 수정: allManagerList → filteredManagers */}
          {filteredManagers && filteredManagers.length > 0 ? (
            filteredManagers.map((v, i) => (
              <AdminCardWrapper
                key={i}
                item={v}
                checkOption
                isCheck={select.some((s) => s.userSeq === v.userSeq)} // 🔄 수정: includes → some으로 변경
                onClick={handleCheck}
              />
            ))
          ) : allManagerList === null ? (
            <BaseSkeleton />
          ) : (
            // ✨ 추가: 검색 결과 없을 때 메시지
            <div className="flex items-center justify-center py-8 text-gray-400">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="shrink-6 px-6">
        <Button label="저장" onClick={handleSubmit} />
      </div>
    </div>
  );
};
