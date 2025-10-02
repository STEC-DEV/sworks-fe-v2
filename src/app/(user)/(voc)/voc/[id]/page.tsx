"use client";
import { KeyValueItem } from "@/app/(user)/equipment/[id]/[history-id]/page";
import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import CheckDialog from "@/components/common/check-dialog";
import IconButton from "@/components/common/icon-button";
import AppTitle from "@/components/common/label/title";
import ReplyAddForm from "@/components/form/normal/voc/reply-add";
import BaseDialog from "@/components/ui/custom/base-dialog";
import { useVocDetailStore } from "@/store/normal/voc/detail-store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import dialogText from "../../../../../../public/dialog-text.json";
import { format } from "date-fns";
import { ProcessBadge } from "../_components/item";
import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import TypeEditForm from "@/components/form/normal/voc/type-edit";

const Page = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { id } = useParams();
  const { vocDetail, getVocDetail } = useVocDetailStore();
  useEffect(() => {
    if (!id) return;
    getVocDetail(id.toString());
  }, [id]);

  return (
    <div className="flex gap-12">
      {vocDetail ? (
        <>
          <div className="flex-1  flex flex-col gap-6 min-w-0">
            <AppTitle title={vocDetail?.logs.title} />
            <div className="flex justify-between items-center">
              <KeyValueItem
                label="유형"
                value={vocDetail.logs.serviceTypeName}
                valueStyle="text-md text-blue-500 font-normal"
              />
              <BaseDialog
                title="담당 유형"
                triggerChildren={<IconButton icon="SquarePen" />}
                open={open}
                setOpen={setOpen}
              >
                <TypeEditForm setOpen={setOpen} />
              </BaseDialog>
            </div>

            <KeyValueItem
              label="전화번호"
              value={vocDetail.logs.phone}
              valueStyle="text-md font-normal"
            />
            <KeyValueItem
              label="내용"
              value={vocDetail.logs.content}
              valueStyle="text-md font-normal"
            />
            <div className="w-full overflow-x-auto ">
              <div className="flex gap-4 pb-2 min-w-max w-full">
                {vocDetail.logs.attaches.map((a, i) => (
                  <DialogCarousel
                    key={i}
                    currentIndex={i}
                    pathList={vocDetail.logs.attaches.map((d, j) => d.path)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1  flex flex-col gap-6 min-w-0 ">
            <AppTitle title="민원 답변" />
            <ReplyAddForm />
            <div className="flex flex-col gap-6">
              {vocDetail.replys.map((r, i) => (
                <ReplyBox key={i} data={r} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <BaseSkeleton />
          <BaseSkeleton />
        </>
      )}
    </div>
  );
};

const ReplyBox = ({ data }: { data: VocReply }) => {
  const [open, setOpen] = useState<boolean>(false);

  const process = () => {
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
    <CustomCard className="gap-2 px-0" size={"sm"}>
      <div className="flex justify-between items-center px-4">
        <div className="space-x-2">
          <span className="text-xs text-[var(--description-light)]">
            {format(data.createDt, "yyyy-MM-dd hh:mm:ss")}
          </span>
          <span className="text-xs text-[var(--description-light)]">
            {data.createUser}
          </span>
        </div>

        <div className="flex gap-2 justify-end px-4">
          <BaseDialog
            title="답변 수정"
            open={open}
            setOpen={setOpen}
            triggerChildren={<IconButton icon="SquarePen" />}
          >
            <div></div>
          </BaseDialog>
          <CheckDialog
            title={dialogText.replyItemDelete.title}
            description={dialogText.replyItemDelete.description}
            actionLabel={dialogText.replyItemDelete.actionLabel}
            onClick={() => {}}
          >
            <IconButton icon="Trash2" size={16} />
          </CheckDialog>
        </div>
      </div>
      <div className="px-4">{process()}</div>

      <div className="text-sm px-4">{data.content}</div>

      <div className="w-full overflow-x-auto px-4">
        <div className="flex gap-4 pb-2 min-w-max w-full">
          <DialogCarousel pathList={data.attaches.map((d, j) => d.path)} />
        </div>
      </div>
    </CustomCard>
  );
};

export default Page;
