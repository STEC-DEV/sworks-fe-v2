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

interface CheckDialogProps {
  title: string;
  description: string;
  actionLabel: string;
  children: React.ReactNode;
  onClick: () => void;
}

const CheckDialog = ({
  title,
  description,
  actionLabel,
  onClick,
  children,
}: CheckDialogProps) => {
  return (
    <AlertDialog>
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
            className="rounded-[4px] bg-red-600 hover:bg-red-500 text-white hover:cursor-pointer"
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
