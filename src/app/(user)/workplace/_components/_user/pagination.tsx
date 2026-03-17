"use client";
import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import IconButton from "@/components/common/icon-button";
import ExcelAddForm from "@/components/form/normal/user/excel-add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import CommonPagination from "@/components/ui/custom/pagination/common-pagination";
import { usePermission } from "@/hooks/usePermission";
import api from "@/lib/api/api-manager";
import { useUIStore } from "@/store/common/ui-store";
import { useUserMainStore } from "@/store/normal/user/main-store";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const UserPagination = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { userList, loadingKeys } = useUserMainStore();
  const { isLoading, hasError } = useUIStore();
  const { canWorkerEdit } = usePermission();
  const router = useRouter();

  if (isLoading(loadingKeys.LIST) || !userList)
    return <BaseSkeleton className="h-9" />;
  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <div className="flex gap-4">
      <CommonPagination totalCount={userList.meta.totalCount}>
        {canWorkerEdit && (
          <>
            <IconButton
              icon="FileDown"
              tooltip="사용자 추가 양식"
              bgClassName="border border-border-strong shadow-sm !rounded-DEFAULT bg-surface hover:border-primary"
              onClick={downloadExcel}
            />
            <BaseDialog
              title="사용자 밀어넣기"
              triggerChildren={
                <IconButton
                  icon="Upload"
                  bgClassName="border border-border-strong shadow-sm !rounded-DEFAULT bg-surface hover:border-primary"
                />
              }
              open={open}
              setOpen={setOpen}
            >
              <ExcelAddForm onClose={() => setOpen(false)} />
            </BaseDialog>
            <Button
              label="근무자 생성"
              size={"sm"}
              icon={<Plus size={16} />}
              onClick={() => router.push("/workplace/add-user")}
            />
          </>
        )}
      </CommonPagination>
    </div>
  );
};

export default UserPagination;

const downloadExcel = async () => {
  try {
    const res = await api.get(`user/w/sign/downloadform`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "사용자_추가_양식.xlsx";
    document.body.appendChild(a);
    a.click();
    // 정리
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    console.error("다운로드 실패 :", err);
    toast.error("다운로드 에러발생");
  }
};
