"use client";
import AppTitle from "@/components/common/label/title";
import React, { useState } from "react";

import AdminFilter from "./components/user-filter";

import AdminList from "./components/user-list";
import AdminPagination from "./components/user-pagination";
import { ChevronRight, DotIcon, Users2 } from "lucide-react";
import BaseDialog from "@/components/ui/custom/base-dialog";
import Department from "./components/dept";
import { usePermission } from "@/hooks/usePermission";

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { canEdit } = usePermission();
  return (
    <>
      <div className="flex justify-between items-center ">
        <AppTitle title="관리자" icon={Users2} />
        {canEdit && (
          <BaseDialog
            title="부서"
            open={open}
            setOpen={setOpen}
            triggerChildren={
              <div className="flex gap-1 items-center group cursor-pointer">
                <span className="text-sm text-[var(--description-light)] group-hover:text-blue-500 ">
                  부서관리
                </span>
                <ChevronRight
                  size={16}
                  className="text-[var(--icon)] group-hover:text-blue-500"
                />
              </div>
            }
          >
            <Department />
          </BaseDialog>
        )}
      </div>

      <AdminFilter />
      <AdminPagination />
      <AdminList />
    </>
  );
};

export default Page;
