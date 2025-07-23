import React from "react";

import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../../select";
import { ViewState } from "@/types/pagination";

interface ViewSelectProps {
  value: string;
  onChange: (view: string) => void;
}

const ViewSelect = ({ value, onChange }: ViewSelectProps) => {
  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger
        className="border-[var(--border)] rounded-[4px] w-25 bg-white hover:cursor-pointer  focus-visible:ring-0 
    focus-visible:outline-none focus-visible:border-[var(--border)] "
      >
        <SelectValue placeholder="select" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectGroup>
          {Object.entries(ViewState).map(([key, value]) => {
            return (
              <SelectItem
                className="hover:cursor-pointer"
                key={key}
                value={value.toString()}
              >
                {key}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ViewSelect;
