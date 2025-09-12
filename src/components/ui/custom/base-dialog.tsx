import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { ScrollArea } from "../scroll-area";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
  className?: string;
  title: string;
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BaseDialog = ({
  className,
  title,
  triggerChildren,
  children,
  open,
  setOpen,
}: BaseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>{triggerChildren}</DialogTrigger>
      <DialogContent
        className={cn(
          "h-auto  bg-white overflow-hidden px-0 flex flex-col gap-6 xl:h-[80vh]",
          className
        )}
      >
        <DialogHeader className="px-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default BaseDialog;
