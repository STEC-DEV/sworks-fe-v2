import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva("text-xs text-white rounded-[4px] hover:bg-blue-600 hover:cursor-pointer", {
  variants: {
    /**색상변경 */
    variant: {
      default: "bg-blue-500",
    },
    size: {
      default: "w-full py-2",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  label: string

}

const Button = ({ label, variant, size, ...props }: ButtonProps) => {
  return <button className={cn(buttonVariants({ variant, size }))} {...props}>{label}</button>;
};

export default Button;
