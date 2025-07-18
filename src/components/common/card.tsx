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
        small: "",
        large: "",
      },
      size: {
        default: "",
        sm: "",
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
