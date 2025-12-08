"use client";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import BaseSkeleton from "@/components/common/base-skeleton";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import QeEditForm from "@/components/form/normal/qe/edit";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { useDecodeParam } from "@/hooks/params";
import { usePermission } from "@/hooks/usePermission";
import { useUIStore } from "@/store/common/ui-store";
import { useQeDetailStore } from "@/store/normal/qe/qe-detail-store";
import { QeDetail, QeSub, QeViewMain } from "@/types/normal/qe/checklist";
import { format } from "date-fns";
import { CircleCheckBig } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { rawValue: id } = useDecodeParam("id");
  const { qeDetail, getQeDetail, loadingKeys } = useQeDetailStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!id) return;
    getQeDetail(id);
  }, [id]);

  if (isLoading(loadingKeys.DETAIL) || !qeDetail)
    return (
      <div className="flex flex-col gap-6 overflow-hidden">
        <BaseSkeleton className="w-30 h-7" />
        <div className="flex flex-col gap-4 w-full xl:w-150">
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
          <BaseSkeleton className="h-5" />
        </div>
        <BaseSkeleton className="h-7" />
        {Array.from({ length: 10 }, (_, i) => (
          <BaseSkeleton key={i} className="h-12" />
        ))}
        <BaseSkeleton className="flex-1" />
      </div>
    );
  if (hasError(loadingKeys.DETAIL)) return <div> 에러발생</div>;

  const totalPoint = qeDetail.mains.reduce(
    (acc, value) => acc + value.chkMainTotalPoint,
    0
  );

  return (
    <>
      <div className="flex flex-col gap-6 xl:w-150">
        <AppTitle title="품질평가" isBorder />
        <div className="flex flex-col gap-4 w-full xl:w-150">
          <KeyValueItem
            label={"업무유형"}
            value={qeDetail.serviceTypeName}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle="flex-row justify-between"
          />
          <KeyValueItem
            label={"관리부문"}
            value={qeDetail.divCodeName}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle="flex-row justify-between"
          />
          <KeyValueItem
            label={"관리유형"}
            value={qeDetail?.typeCodeName}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle=" flex-row justify-between"
          />
          <KeyValueItem
            label={"평가자"}
            value={qeDetail.createUser}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle=" flex-row justify-between"
          />
          <KeyValueItem
            label={"평가일시"}
            value={format(qeDetail.createDt, "yyyy-MM-dd HH:mm:ss")}
            labelStyle="text-sm"
            valueStyle="font-medium text-sm"
            mainStyle=" flex-row justify-between"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <AppTitle title="평가항목" isBorder />
        <div className="flex gap-2 items-center">
          <span className="text-md text-[var(--description-light)]">총점</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold text-blue-500 ">
              {qeDetail.totalScore}
            </span>
            <span className="text-md text-[var(--description-light)]">/</span>
            <span className="text-lg font-semibold text-[var(--description-light)] ">
              {totalPoint}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {qeDetail.mains.map((main, idx) => (
            <QeChkAccordion key={idx} main={main} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;

const QeChkAccordion = ({ main }: { main: QeViewMain }) => {
  const { canWorkerEdit } = usePermission();
  const [open, setOpen] = useState<boolean>(false);
  return (
    <CustomAccordion
      label={`${main.chkMainTitle}`}
      labelOptions={
        <div className="flex items-center gap-1">
          <span className="text-md text-blue-500">
            {main.chkMainTotalScore}
          </span>
          <span className="text-md text-[var(--description-light)]">/</span>

          <span className="text-md text-[var(--description-light)]">
            {main.chkMainTotalPoint}
          </span>
        </div>
      }
      icon={CircleCheckBig}
      optionChildren={
        canWorkerEdit && (
          <BaseDialog
            title={`${main.chkMainTitle} 수정`}
            open={open}
            setOpen={setOpen}
            triggerChildren={<IconButton icon="SquarePen" />}
          >
            <QeEditForm data={main} onClose={() => setOpen(false)} />
          </BaseDialog>
        )
      }
      isPaddingBottom={false}
    >
      <>
        {main.subs.map((sub, idx) => {
          return <QeChkSubSection key={idx} sub={sub} />;
        })}
        {main.chkMainSumYn && (
          <div className="flex gap-2 justify-center items-center border-t-1 border-border py-2">
            <span className="text-sm ">소계</span>
            <span className="text-lg text-blue-500 ">
              {main.chkMainTotalScore}
            </span>
          </div>
        )}
      </>
    </CustomAccordion>
  );
};

const QeChkSubSection = ({ sub }: { sub: QeSub }) => {
  return (
    <div>
      <span className="block px-4 py-2 bg-[var(--background)]">
        {sub.chkSubTitle}
      </span>
      <div className="flex flex-col gap-4 p-4">
        {sub.details.map((detail, idx) => {
          return <QeChkDetailItem key={idx} detail={detail} />;
        })}
      </div>
      {sub.chkSubSumYn && (
        <div className="flex gap-2 justify-center items-center border-t-1 border-border py-2">
          <span className="text-sm ">소계</span>
          <span className="text-lg text-blue-500 ">{sub.chkSubTotal}</span>
        </div>
      )}
    </div>
  );
};

const QeChkDetailItem = ({ detail }: { detail: QeDetail }) => {
  return (
    <div className="flex justify-between items-center ">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-[var(--description-dark)]">
          {detail.chkDetailTitle}
        </span>
        <span className="text-sm ">{detail.chkDetailItem}</span>
      </div>
      <span className="text-md font-medium text-blue-500 whitespace-nowrap">
        {detail.score}점
      </span>
    </div>
  );
};
