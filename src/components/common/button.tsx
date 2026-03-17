import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ChevronDown, icons, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import BaseDialog from "../ui/custom/base-dialog";
import CustomCard from "./card";

const buttonVariants = cva(
  "flex items-center justify-center gap-4 text-sm font-medium text-white rounded-[4px] hover:bg-blue-600 cursor-pointer whitespace-nowrap outline-none",
  {
    variants: {
      /**디자인 */
      variant: {
        // default: "bg-blue-500 border border-blue-500",
        default: "bg-primary hover:bg-primary-hover h-9",
        secondary: "text-primary bg-parent hover:bg-primary-background",
        filter: "px-2 py-2",
        prev: "bg-surface border border-border  text-description hover:border-border-strong hover:bg-surface shadow-sm",
        login: `bg-sidebar-item-bg text-sidebar-muted border border-sidebar-border
 hover:bg-sidebar-active-bg hover:text-sidebar-foreground hover:border-white/20
 transition-all duration-200 cursor-pointer hover:font-bold `,
        disabled:
          "border border-[var(--border)] bg-[var(--background)] text-[var(--description-light)] hover:bg-[var(--background)] cursor-not-allowed ",
        delete: `bg-red-500 hover:bg-red-600 `,
        gradient:
          "bg-[linear-gradient(135deg,#223377,#4a63bb)] shadow-[0_4px_12px_rgba(34,51,119,0.3)] tracking-[-0.2px]",
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
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  className?: string;
  // icon?: keyof typeof icons;
  icon?: React.ReactNode;
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
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {icon && icon}
      {/* {SelectLucideIcon && (
        <SelectLucideIcon className="text-[var(--icon)] stroke-1 w-5 h-5 group-hover:stroke-2" />
      )} */}
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
        className,
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
