"use client";
import { ProcessBadge } from "@/app/(user)/(voc)/voc/_components/item";
import BaseCarousel from "@/components/common/base-carousel";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import AppTitle from "@/components/common/label/title";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { useDecodeParam } from "@/hooks/params";
import { useUIStore } from "@/store/common/ui-store";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { format } from "date-fns";
import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";
import React, { useEffect } from "react";

const Page = () => {
  const { rawValue: code } = useDecodeParam("seq");
  const { complain, getComplain, loadingKeys } = useVocDetailStore();
  const { isLoading, hasError } = useUIStore();

  useEffect(() => {
    if (!code) return;
    getComplain(code);
  }, [code]);

  if (isLoading(loadingKeys.COMPLAIN) || !complain) return <div></div>;
  if (hasError(loadingKeys.COMPLAIN)) return <div>에러 발생</div>;

  return (
    <div className="flex justify-center h-screen overflow-hidden">
      <div className="flex flex-col gap-6 w-full xl:max-w-[769px] xl:border py-6 h-full bg-white shadow-xl overflow-auto">
        <div className="px-6 shrink-0">
          <AppTitle title="민원조회" isBorder />
        </div>
        <div className="flex flex-col gap-12">
          <Log data={complain.logs} />

          <div className="flex px-6 flex-col gap-4">
            <div className="pb-4 border-b-2 border-border text-md font-semibold">
              처리현황
            </div>
            {complain.replys.length > 0 ? (
              complain.replys.map((v, i) => <Reply key={i} data={v} />)
            ) : (
              <span className="text-sm text-[var(--description-light)]">
                아직 등록된 처리 현황이 없습니다
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Log = ({ data }: { data: LogInfo }) => {
  return (
    <div className="px-6 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm">{data.createUser}</span>
        {/* <span className="text-sm text-blue-500">{data.serviceTypeName}</span> */}
      </div>
      <DialogCarousel pathList={data.attaches.map((v) => v.path)} isSmall />
      <span className="text-sm">{data.title}</span>

      <span className="text-sm">{data.content}</span>
    </div>
  );
};

const Reply = ({ data }: { data: VocReply }) => {
  const status = () => {
    switch (data.status) {
      case 0:
        return (
          <ProcessBadge
            label="미처리"
            icon={AlarmClockIcon}
            style="bg-gray-400 w-fit px-2"
          />
        );
      case 1:
        return (
          <ProcessBadge
            label="처리중"
            icon={RotateCwIcon}
            style="bg-green-500 w-fit px-2"
          />
        );
      case 2:
        return (
          <ProcessBadge
            label="처리완료"
            icon={CheckCircleIcon}
            style="bg-blue-500 w-fit px-2"
          />
        );
    }
  };
  return (
    <CustomCard className="gap-4" size={"sm"}>
      <div className="flex justify-between items-center">
        <span className="text-xs">{data.createUser}</span>
        <span className="text-xs text-[var(--description-light)]">
          {format(data.createDt, "yyyy-MM-dd HH:mm:ss")}
        </span>
      </div>
      <span className="text-sm">{status()}</span>
      {data.attaches.length > 0 && (
        <DialogCarousel pathList={data.attaches.map((v) => v.path)} isSmall />
      )}

      <span className="text-sm">{data.content}</span>
    </CustomCard>
  );
};
