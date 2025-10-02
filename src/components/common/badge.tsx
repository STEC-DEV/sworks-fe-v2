import { AlarmClockIcon, CheckCircleIcon, RotateCwIcon } from "lucide-react";

// 0-미처리 / 1-처리중 / 2-처리완료
export const ProcessBadge = ({ value }: { value: number }) => {
  switch (value) {
    case 0:
      return (
        <div className="flex gap-2 text-white py-0.5 justify-center items-center  rounded-[50px] bg-gray-400 w-fit px-2">
          <AlarmClockIcon size={16} />
          <span className="text-xs">미처리</span>
        </div>
      );
    case 1:
      return (
        <div className="flex gap-2 text-white py-0.5 justify-center items-center  rounded-[50px] bg-green-500 w-fit px-2">
          <RotateCwIcon size={16} />
          <span className="text-xs">처리중</span>
        </div>
      );
    case 2:
      return (
        <div className="flex gap-2 text-white py-0.5 justify-center items-center  rounded-[50px] bg-blue-500 w-fit px-2">
          <CheckCircleIcon size={16} />
          <span className="text-xs">처리완료</span>
        </div>
      );
  }
};
