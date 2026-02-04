import { cn } from "@/lib/utils";

interface KeyValueItemProps {
  label: string;
  value: string;
  mainStyle?: string;
  labelStyle?: string;
  valueStyle?: string;
  isTextArea?: boolean;
  isHorizontal?: boolean;
}

export const KeyValueItem = ({
  label,
  value,
  mainStyle,
  labelStyle,
  valueStyle,
  isTextArea = false,
  isHorizontal = false,
}: KeyValueItemProps) => {
  return (
    <div
      className={cn(
        `flex flex-col gap-1 ${
          isHorizontal ? "flex-row justify-between items-center" : ""
        }`,
        mainStyle,
      )}
    >
      <span
        className={cn(
          "text-sm text-[var(--description-light)] font-medium",
          labelStyle,
        )}
      >
        {label}
      </span>
      {isTextArea ? (
        <p className="whitespace-pre-wrap">{value}</p>
      ) : (
        <span
          className={cn(
            "text-xs font-semibold text-[var(--description-dark)]",
            valueStyle,
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
};
