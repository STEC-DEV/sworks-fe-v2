import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";

interface CheckDialogProps {
  title: string;
  description: string;
  actionLabel: string;
  children: React.ReactNode;
  buttonColor?: string;
  onClick: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CheckDialog = ({
  title,
  description,
  actionLabel,
  onClick,
  buttonColor,
  children,
  open,
  onOpenChange,
}: CheckDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span>{title}</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <span className="text-[var(--description-dark)]">
              {description}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border border-[var(--border)] rounded-[4px] shadow-none hover:cursor-pointer">
            취소
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(
              `rounded-[4px] bg-red-600 hover:bg-red-500 text-white hover:cursor-pointer`,
              buttonColor
            )}
            onClick={onClick}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckDialog;
