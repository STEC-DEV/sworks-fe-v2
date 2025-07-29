import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { LucideIcon } from "lucide-react";
import IconButton from "../icon-button";

interface CustomAccordionProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

const CustomAccordion = ({ icon, label, children }: CustomAccordionProps) => {
  const Icon = icon;
  return (
    <Accordion
      type="single"
      collapsible
      className="border border-[var(--border)] rounded-[4px] shadow-sm"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className=" px-6 hover:no-underline items-center focus-visible:ring-0 focus-visible:outline-none">
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-4">
              <Icon className="w-5 h-5 text-[var(--icon)] " />
              <span className="text-sm font-normal">{label}</span>
            </div>
            <IconButton icon="Plus" />
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
