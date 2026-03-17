import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TaskBoxProps {
  data: Task;
}

export const TaskBox = ({ data }: TaskBoxProps) => {
  const [isHover, setIsHover] = useState<boolean>(false);
  const [showLeft, setShowLeft] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const taskDuration = () => {
    if (data.endDt)
      return `${format(data.startDt, "yyyy/MM/dd")} ~ ${format(
        data.endDt,
        "yyyy/MM/dd",
      )}`;
    else return format(data.startDt, "yyyy/MM/dd");
  };

  const handleMouseEnter = () => {
    setIsHover(true);

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const spaceOnRight = windowWidth - rect.right;

      // 오른쪽 공간이 부족하면 왼쪽에 표시 (200px는 호버 메뉴 예상 너비)
      setShowLeft(spaceOnRight < 200);
    }
  };

  const statusData = useMemo(() => {
    if (!data || data.users.length < 1) return { total: 0, done: 0, active: 0 };

    const total = data.users.length;
    const done = data.users.filter(
      (user) => user.repeats === user.counts,
    ).length;
    const active = data.users.filter(
      (user) => user.repeats !== user.counts,
    ).length;

    return { total, done, active };
  }, [data]);

  const isComplete =
    statusData.total > 0 && statusData.total === statusData.done;

  const status = () => {
    let total = 0;
    let done = 0;
    let active = 0;
    if (!data) return <BaseSkeleton />;

    if (data.users.length < 1)
      return <StatusBox total={total} done={done} active={active} />;

    total = data.users.length;
    done = data.users.filter((user) => user.repeats === user.counts).length;
    active = data.users.filter((user) => user.repeats !== user.counts).length;

    return <StatusBox total={total} done={done} active={active} />;
  };

  return (
    <Link href={`/daily/${data.taskSeq}/${data.workDt}`}>
      <CustomCard
        ref={cardRef}
        className={`relative ${isComplete && "opacity-50 "}`}
        variant={"list"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHover(false)}
      >
        <span className="text-xs text-primary font-bold">
          {data.serviceTypeName}
        </span>
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium">{data.title}</span>
          {/* <span className="text-xs text-[var(--description-dark)]">
            {taskDuration()}
          </span> */}
        </div>
        <div className=" w-full">
          <CardStatus data={!!data} statusData={statusData} />
        </div>
        <CustomCard
          className={`max-h-70 md:w-50 flex-col gap-2 absolute top-0 bg-primary-background shadow-xl z-10 overflow-auto ${
            isHover ? "hidden md:flex" : "hidden"
          } ${showLeft ? "right-full mr-2" : "left-full ml-2"} `}
          variant={"list"}
        >
          {data.users.length > 0 ? (
            data.users.map((u, i) => {
              return (
                <KeyValueItem
                  key={i}
                  label={u.userName}
                  value={`${u.counts.toString()}/${u.repeats.toString()}`}
                  valueStyle="text-xs font-normal text-primary font-semibold"
                  isHorizontal
                />
              );
            })
          ) : (
            <span className="text-xs text-[var(--description-light)]">
              근무자 없음
            </span>
          )}
        </CustomCard>
      </CustomCard>
    </Link>
  );
};

const StatusBox = ({
  total,
  done,
  active,
}: {
  total: number;
  done: number;
  active: number;
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs  text-[var(--description-light)]">
        전체 {total.toString()}
      </span>
      <span>·</span>
      <span className="text-xs  text-[var(--description-light)]">
        완료 {done.toString()}
      </span>
      <span>·</span>
      <span className="text-xs  text-[var(--description-light)]">
        진행 {active.toString()}
      </span>
    </div>
  );
};

// ── 커스텀 툴팁 ──────────────────────────────
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-1.5 shadow-sm text-xs text-description-strong">
      {payload[0].name} {payload[0].value}
    </div>
  );
};

// ── 메인 컴포넌트 ─────────────────────────────
export const CardStatus = ({
  data,
  statusData,
}: {
  data: boolean; // 로딩 여부
  statusData: { total: number; done: number; active: number };
}) => {
  const { total, done, active } = statusData;

  // 마운트 후 실제 퍼센트로 애니메이션
  const [targetPercent, setTargetPercent] = useState(0);

  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => setTargetPercent(percent), 100);
    return () => clearTimeout(timer);
  }, [data, percent]);

  return (
    <div className="flex flex-col gap-1.5 border-t pt-2 w-full">
      {/* StatusBox + 퍼센트 */}
      <div className="flex items-center justify-between">
        {!data ? (
          <div className="h-4 w-32 animate-pulse rounded bg-skeleton" />
        ) : (
          <>
            <StatusBox total={total} done={done} active={active} />
            <span className="text-xs font-bold text-primary">{percent}%</span>
          </>
        )}
      </div>

      {/* 진행률 바 */}
      {!data ? (
        <div className="h-1.5 w-full animate-pulse rounded-full bg-skeleton" />
      ) : (
        <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${targetPercent}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      )}
    </div>
  );
};
