import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { icons, LucideIcon } from "lucide-react";
import React from "react";

const buttonVariants = cva(
  "flex items-center justify-center gap-4 text-xs text-white rounded-[4px] hover:bg-blue-600 hover:cursor-pointer",
  {
    variants: {
      /**색상변경 */
      variant: {
        default: "bg-blue-500",
        filter: "px-2 py-2",
        login: `border bg-white text-[var(--description-dark)] hover:border-red-500 hover:bg-white 
          hover:ring-1 hover:ring-red-500 hover:ring-inset duration-300 group`,
      },
      size: {
        default: "w-full py-2",
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

export default Button;
