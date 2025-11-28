import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DaySchedule,
  ScheduleAttach,
} from "@/types/normal/schedule/day-schedule";
import React, { useEffect, useMemo, useState } from "react";
import IconButton from "../icon-button";
import {
  AlignLeft,
  BellIcon,
  Bookmark,
  ClockIcon,
  DownloadIcon,
  Ellipsis,
  File,
  Icon,
  LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import Tab from "../tab";
import { ScrollArea } from "@/components/ui/scroll-area";
import DialogCarousel from "@/components/ui/custom/image/size-carousel";
import { downloadFile } from "@/app/(user)/facility/_components/fac-info";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import BaseOverlay from "../overlay";
import { createPortal } from "react-dom";

interface ScheduleItemProps {
  data: DaySchedule;
}

const ScheduleItem = ({ data }: ScheduleItemProps) => {
  const { canWorkerEdit } = usePermission();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!data) return;
    if (!data.logs) return;
    if (!open) return;
  }, [data, open]);

  const getTab = () => {
    if (!data.logs) return null;

    const hasBeforeImages = data.logs.beforeImages.length > 0;
    const hasAfterImages = data.logs.afterImages.length > 0;

    if (!hasBeforeImages && !hasAfterImages) return null;

    const tabConfigs = [];

    if (hasBeforeImages) {
      tabConfigs.push({
        tabTitle: "before",
        render: (
          <ImageCarousel pathList={data.logs.beforeImages.map((v) => v.path)} />
        ),
        size: "sm" as const,
      });
    }

    if (hasAfterImages) {
      tabConfigs.push({
        tabTitle: "after",
        render: (
          <ImageCarousel pathList={data.logs.afterImages.map((v) => v.path)} />
        ),
        size: "sm" as const,
      });
    }

    return <Tab configs={tabConfigs} />;
  };

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        console.log(open);
        setOpen(open);
      }}
    >
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {/* <ScheduleTrigger label={data.schTitle} color={data.viewColor} /> */}
        <div
          className="flex items-center justify-start min-w-0 text-white text-xs w-full px-2 py-[1px] rounded-[4px] hover:cursor-pointer"
          style={{ backgroundColor: `#${data.viewColor}` }}
        >
          <span className="w-full truncate">{data.title}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white  "
        side="left"
        sideOffset={5}
        align="start"
        alignOffset={0}
        collisionPadding={10} // 화면 가장자리로부터 10px 여백
        avoidCollisions={true} // 충돌 감지 활성화
        sticky="partial" // 부분적으로 화면에 붙음
      >
        {canWorkerEdit && (
          <div className="flex justify-end">
            <IconButton
              icon="SquarePen"
              onClick={() => {
                router.push(`/schedule/edit/${data.schSeq}`);
              }}
            />
            <IconButton icon="Trash2" />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <span>{data.title}</span>
            <span className="text-xs text-[var(--description-light)]">{`${format(
              data.startDt,
              "yyyy-MM-dd "
            )} ~ ${data.endDt ? format(data.endDt, "yyyy-MM-dd ") : ""}`}</span>
          </div>

          <div className="space-y-2">
            <ScheduleIconValue icon={AlignLeft} value={data.description} />
            <ScheduleIconValue
              icon={BellIcon}
              value={
                data.alarmYn
                  ? `${data.alarmOffsetDays}일 전 ${data.alarmDt.slice(0, 5)}`
                  : undefined
              }
            />

            <ScheduleIconValue icon={Bookmark} value={data.logs?.logComments} />
            <ScheduleIconFileValue icon={File} attach={data.logs?.files} />

            {/* 작업 전후 이미지 */}
            {getTab()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const ScheduleIconValue = ({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value?: string | null;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-center  gap-2">
      <Icon size={16} className="text-[var(--icon)]" />
      <span className="text-sm text-[var(--description-dark)]">{value}</span>
    </div>
  );
};

const ScheduleIconFileValue = ({
  icon: Icon,
  attach,
}: {
  icon: LucideIcon;
  attach?: ScheduleAttach[];
}) => {
  if (!attach) return null;
  return (
    <div className="flex flex-col w-full  gap-2">
      <div className="flex gap-2 items-center">
        <Icon size={16} className="text-[var(--icon)]" />
        <span className="text-sm text-[var(--description-dark)]">첨부파일</span>
      </div>

      <div className="flex flex-col gap-2 ">
        {attach.map((a, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-1 text-xs text-[var(--description-dark)] border border-border rounded-[4px] cursor-pointer hover:bg-background"
            onClick={() => {
              downloadFile(a.path, a.fileName);
            }}
          >
            <span>{a.fileName}</span>
            <DownloadIcon
              size={16}
              strokeWidth={1.5}
              className="text-[var(--icon)]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleItem;

export const ExtendedSchedule = ({
  schedules,
  day,
}: {
  schedules: DaySchedule[];
  day: string;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-center rounded-[4px] hover:bg-[var(--background-dark)] cursor-pointer">
          {/* <span className="text-xs">more</span> */}
          <Ellipsis className="text-[var(--icon)]" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background w-50 space-y-2 "
        side="right"
        align="start"
        sideOffset={5}
        collisionPadding={16}
        avoidCollisions={true}
      >
        <div className="flex items-center justify-center">
          <span className="">{day}</span>
        </div>

        <div className="space-y-1">
          {schedules.map((s, i) => (
            // <div key={i}>{s.title}</div>
            <ScheduleItem key={i} data={s} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface ImageCarouselProps {
  pathList: string[];
}

const ImageCarousel = ({ pathList }: ImageCarouselProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const handlePrev = () => {
    setIndex((prev) => {
      if (prev === 0) return prev;
      else {
        return prev - 1;
      }
    });
  };

  const handleNext = () => {
    setIndex((prev) => {
      if (prev === pathList.length - 1) return prev;
      else {
        return prev + 1;
      }
    });
  };
  return (
    <>
      {/* <Image
        src={path}
        alt="이미지"
        width={48}
        height={32}
        onClick={() => setOpen(true)}
      /> */}
      <div className="relative ">
        <Carousel className="w-full px-10 ">
          <CarouselContent>
            {pathList &&
              pathList.map((f, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-32 border  rounded-[4px] border-border overflow-hidden  cursor-pointer">
                    <Image
                      src={f}
                      fill
                      className="object-cover"
                      alt="이미지"
                      onClick={() => {
                        setOpen(true);
                        setIndex(index);
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          {pathList.length > 1 && (
            <>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </>
          )}
        </Carousel>
      </div>
      {open && (
        <>
          <BaseOverlay isOpen={open} onBackClick={() => setOpen(false)}>
            <div className="flex items-center justify-center w-full h-full p-4">
              <div className="relative max-w-[90vw] max-h-[90vh]">
                <Image
                  src={pathList[index]}
                  alt="이미지"
                  width={0}
                  height={0}
                  sizes="90vw"
                  className="w-auto h-auto max-w-[85vw] max-h-[85vh]"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            </div>
          </BaseOverlay>
          {pathList.length > 1 &&
            createPortal(
              <>
                {pathList.length > 1 ? (
                  <>
                    <IconButton
                      bgClassName="fixed top-1/2 -translate-y-1/2 left-4 bg-gray-50 opacity-50 hover:opacity-100 z-[60]"
                      icon="ChevronLeft"
                      size={30}
                      onClick={(e) => {
                        e.stopPropagation();

                        // 이전 이미지 로직
                        handlePrev();
                      }}
                    />
                    <IconButton
                      bgClassName="fixed top-1/2 -translate-y-1/2 right-4 bg-gray-50 opacity-50 hover:opacity-100 z-[60]"
                      icon="ChevronRight"
                      size={30}
                      onClick={(e) => {
                        e.stopPropagation();
                        // 다음 이미지 로직
                        handleNext();
                      }}
                    />
                  </>
                ) : null}

                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white z-[60] tabular-nums">
                  <span className="text-xl ">
                    {index + 1}/{pathList.length}
                  </span>
                </div>
              </>,
              document.body
            )}
        </>
      )}
    </>
  );
};
