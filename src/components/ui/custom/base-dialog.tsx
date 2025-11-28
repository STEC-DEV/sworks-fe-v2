import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { ScrollArea } from "../scroll-area";
import { cn } from "@/lib/utils";

interface BaseDialogProps {
  className?: string;
  description?: string;
  title: string;
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BaseDialog = ({
  className,
  title,
  description,
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
          " bg-white overflow-hidden px-0 flex flex-col gap-6 max-h-[90vh] xl:max-h-[80vh] min-h-0",
          className
        )}
      >
        <DialogHeader className="px-6 flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 flex">{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseDialog;
