import BaseSkeleton from "@/components/common/base-skeleton";
import CustomCard from "@/components/common/card";
import { KeyValueItem } from "@/components/ui/custom/key-value";
import { format } from "date-fns";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

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
        className={`relative ${isComplete && "border-blue-500 bg-blue-50"}`}
        variant={"list"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHover(false)}
      >
        <span className="text-xs text-blue-500">{data.serviceTypeName}</span>
        <div className="flex justify-between items-end">
          <span className="text-sm font-medium">{data.title}</span>
          {/* <span className="text-xs text-[var(--description-dark)]">
            {taskDuration()}
          </span> */}
        </div>
        <div className="flex justify-end">
          {!data ? (
            <BaseSkeleton />
          ) : (
            <StatusBox
              total={statusData.total}
              done={statusData.done}
              active={statusData.active}
            />
          )}
        </div>

        <CustomCard
          className={` md:w-50 flex-col gap-2 absolute top-0 bg-blue-50 shadow-lg z-10 ${
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
                  valueStyle="text-xs font-normal text-blue-500"
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
