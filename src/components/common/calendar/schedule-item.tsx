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

interface ScheduleItemProps {
  data: DaySchedule;
}

const ScheduleItem = ({ data }: ScheduleItemProps) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const scheduleDate = useMemo(() => {
    // const startDate = format;
  }, [data]);

  useEffect(() => {
    if (!data) return;
    if (!data.logs) return;
    if (!open) return;

    console.log(
      data.logs.beforeImages
        .map((a, j) => a.path)
        .filter((path): path is string => path !== undefined)
    );
  }, [data, open]);

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
      <PopoverContent className="bg-white " side="left" sideOffset={5}>
        <div className="flex justify-end">
          <IconButton
            icon="SquarePen"
            onClick={() => {
              router.push(`/schedule/edit/${data.schSeq}`);
            }}
          />
          <IconButton icon="Trash2" />
        </div>
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
            {data.logs &&
            data.logs.afterImages.length !== 0 &&
            data.logs.beforeImages.length !== 0 ? (
              <Tab
                configs={[
                  {
                    tabTitle: "before",
                    render: (
                      <>
                        <DialogCarousel
                          pathList={data.logs.beforeImages
                            .map((a, j) => a.path)
                            .filter(
                              (path): path is string => path !== undefined
                            )}
                          imageTxt={data.logs.beforeImages.map(
                            (a, j) => a.comments
                          )}
                        />
                      </>
                    ),
                    size: "sm",
                  },
                  {
                    tabTitle: "after",
                    render: (
                      <>
                        <DialogCarousel
                          pathList={data.logs.afterImages
                            .map((a, j) => a.path)
                            .filter(
                              (path): path is string => path !== undefined
                            )}
                          imageTxt={data.logs.afterImages.map(
                            (a, j) => a.comments
                          )}
                        />
                      </>
                    ),
                    size: "sm",
                  },
                ]}
              />
            ) : null}
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
    <div className="flex items-center  gap-4">
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
    <div className="flex items-center  gap-4">
      <Icon size={16} className="text-[var(--icon)]" />
      <div className="flex gap-4 items-center">
        {attach.map((a, i) => (
          <div
            key={i}
            className="px-4 py-1 text-xs text-[var(--description-dark)] border border-border rounded-[4px] cursor-pointer hover:bg-background"
            onClick={() => {
              downloadFile(a.path, a.fileName);
            }}
          >
            <span>{a.fileName}</span>
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
      <PopoverTrigger>
        <div className="flex items-center justify-center rounded-[4px] hover:bg-[var(--background-dark)] cursor-pointer">
          <span className="text-xs">more</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-background w-50 space-y-2 ">
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

// <ScrollArea>
//   <div className="">
//     {data.logs.beforeImages.map((v, i) => (
//       <div key={i} className="space-y-2">
//         <div className="w-60 h-40 border border-border rounded-[4px]">
//           <img
//             className="w-full h-full object-cover"
//             src={v.path}
//           />
//         </div>
//         <span className="text-xs">{v.comments}</span>
//       </div>
//     ))}
//   </div>
// </ScrollArea>
