import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ChevronDown, icons, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import BaseDialog from "../ui/custom/base-dialog";
import CustomCard from "./card";

const buttonVariants = cva(
  "flex items-center justify-center gap-4 text-xs text-white rounded-[4px] hover:bg-blue-600 hover:cursor-pointer",
  {
    variants: {
      /**색상변경 */
      variant: {
        default: "bg-blue-500",
        secondary: "text-blue-500 bg-parent hover:bg-blue-50",
        filter: "px-2 py-2",
        prev: "border border-[var(--border)] bg-[var(--background)] text-[var(--description-light)] hover:bg-[var(--border)]",
        login: `border bg-white text-[var(--description-dark)] hover:border-red-500 hover:bg-white 
          hover:ring-1 hover:ring-red-500 hover:ring-inset duration-300 group`,
        delete: `bg-red-500 `,
      },
      size: {
        default: "w-full py-2",
        sm: "w-fit px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  className?: string;
  // icon?: keyof typeof icons;
  icon?: LucideIcon;
  label: string;
}

const Button = ({
  className,
  icon,
  label,
  variant,
  size,
  ...props
}: ButtonProps) => {
  const SelectLucideIcon = icon ? icon : null;
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {SelectLucideIcon && (
        <SelectLucideIcon className="text-[var(--icon)] stroke-1 w-5 h-5 group-hover:stroke-2" />
      )}
      {label}
    </button>
  );
};

export const TriggerButton = ({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <button
      className={cn(
        `w-full   rounded-[4px] border border-[var(--border)] text-[var(--placeholder)] h-9 text-sm
        flex justify-between items-center px-3 py-2
        shadow-none transition duration-300
                focus-visible:border-[var(--primary)] focus-visible:border-1 focus-visible:ring-1 focus-visible:ring-[var(--primary)]
                hover:border-[var(--primary)] hover:cursor-pointer
                data-[placeholder]:text-[var(--placeholder)] data-[state=open]:ring-[var(--primary)] data-[state=open]:border-[var(--primary)] data-[state=open]:ring-1 data-[state=open]:ring-inset
                `,
        className
      )}
      type="button"
      {...props}
    >
      {children}
      <ChevronDown size={16} className="text-[var(--icon)]" />
    </button>
  );
};

export default Button;

export const DeleteButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <BaseDialog
      title="삭제"
      triggerChildren={
        <Button
          className="hover:text-red-500 hover:border-red-500 hover:bg-red-50"
          label="삭제"
          variant={"prev"}
          size={"sm"}
        />
      }
      open={open}
      setOpen={setOpen}
    >
      <CustomCard></CustomCard>
    </BaseDialog>
  );
};
