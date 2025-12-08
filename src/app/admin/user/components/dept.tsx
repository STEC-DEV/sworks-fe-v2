import BaseSkeleton from "@/components/common/base-skeleton";
import Button from "@/components/common/button";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import DeptAddForm from "@/components/form/admin/user/dept-add";
import DeptEditForm from "@/components/form/admin/user/dept-edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import EmptyBox from "@/components/ui/custom/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeptStore } from "@/store/admin/dept/dept-store";
import { useUIStore } from "@/store/common/ui-store";
import React, { useEffect, useState } from "react";
import { dialogText } from "../../../../../public/text";
import { useAdminListStore } from "@/store/admin/admin/admin-list-store";
import { useSearchParams } from "next/navigation";

const Department = () => {
  const { loadingKeys, departmentList, getDepartmentList } = useDeptStore();
  const { isLoading, hasError } = useUIStore();
  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    getDepartmentList();
  }, []);

  if (isLoading(loadingKeys.LIST) || !departmentList)
    return (
      <div className="flex flex-col gap-4 w-full px-6">
        {Array.from({ length: 8 }, (_, i) => (
          <BaseSkeleton key={i} className="h-10" />
        ))}
      </div>
    );

  if (hasError(loadingKeys.LIST)) return <div>에러발생</div>;

  return (
    <div className="flex flex-col gap-6 w-full">
      {departmentList.length > 0 ? (
        <ScrollArea className=" overflow-hidden">
          <div className="px-6 pb-2">
            <div className="flex flex-col gap-4">
              {departmentList.map((v, i) => (
                <DeptCard key={i} data={v} />
              ))}
            </div>
          </div>
        </ScrollArea>
      ) : (
        <EmptyBox message="부서를 생성해주세요." />
      )}

      <div className="px-6 shrink-0">
        <BaseDialog
          title="부서 생성"
          open={open}
          setOpen={setOpen}
          triggerChildren={<Button label="생성" />}
        >
          <DeptAddForm onClose={() => setOpen(false)} />
        </BaseDialog>
      </div>
    </div>
  );
};

export default Department;

const DeptCard = ({ data }: { data: Department }) => {
  const [open, setOpen] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { deleteDept, getDepartmentList } = useDeptStore();
  const { getAdminList } = useAdminListStore();

  const onDelete = async () => {
    if (!searchParams) return;
    await deleteDept(data.deptSeq);
    await getDepartmentList();
    await getAdminList(new URLSearchParams(searchParams));
  };
  return (
    <CustomCard
      className="flex-row justify-between items-center cursor-auto"
      variant={"list"}
      size={"sm"}
    >
      <span className="text-sm">{data.deptName}</span>
      <div className="flex items-center gap-2">
        <BaseDialog
          title="부서수정"
          open={open}
          setOpen={setOpen}
          triggerChildren={<IconButton icon="SquarePen" />}
        >
          <DeptEditForm
            id={data.deptSeq}
            name={data.deptName}
            onClose={() => setOpen(false)}
          />
        </BaseDialog>
        <CheckDialog
          title={dialogText.defaultDelete.title}
          description={dialogText.defaultDelete.description}
          actionLabel={dialogText.defaultDelete.actionLabel}
          onClick={onDelete}
        >
          <IconButton icon="Trash2" />
        </CheckDialog>
      </div>
    </CustomCard>
  );
};
