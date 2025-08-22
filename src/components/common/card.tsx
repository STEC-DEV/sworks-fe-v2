//shadcn 커스텀 카드 ui
import React from "react";
import { Card } from "../ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const appCardVariants = cva(
  "border border-[var(--border)] bg-white rounded-[4px] px-0",
  {
    variants: {
      variant: {
        default: "",
        list: "px-4 py-4 gap-2 hover:cursor-pointer",
        large: "",
      },
      size: {
        default: "",
        sm: "px-2 py-2",
        lg: "py-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof appCardVariants> {
  className?: string;
}

const CustomCard = ({ className, variant, size, ...props }: CardProps) => {
  return (
    <Card
      className={cn(appCardVariants({ variant, size }), className)}
      {...props}
    />
  );
};

export default CustomCard;
