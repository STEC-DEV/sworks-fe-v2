import { PackageOpenIcon } from "lucide-react";
import React from "react";

const EmptyBox = ({ message }: { message?: string }) => {
  return (
    <div className="w-full h-full flex flex-col gap-6 items-center mt-20 ">
      <PackageOpenIcon
        className="text-[var(--icon)]"
        strokeWidth={0.5}
        size={100}
      />
      <span className="text-[var(--description-light)]">
        {message || "내용없음"}
      </span>
    </div>
  );
};

export default EmptyBox;
