import { cn } from "@/lib/utils";

interface KeyValueItemProps {
  label: string;
  value: string;
  mainStyle?: string;
  labelStyle?: string;
  valueStyle?: string;
  isHorizontal?: boolean;
}

export const KeyValueItem = ({
  label,
  value,
  mainStyle,
  labelStyle,
  valueStyle,
  isHorizontal = false,
}: KeyValueItemProps) => {
  return (
    <div
      className={cn(
        `flex flex-col gap-1 ${
          isHorizontal ? "flex-row justify-between items-center" : ""
        }`,
        mainStyle
      )}
    >
      <span
        className={cn("text-xs text-[var(--description-light)]", labelStyle)}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-semibold text-[var(--description-dark)]",
          valueStyle
        )}
      >
        {value}
      </span>
    </div>
  );
};
