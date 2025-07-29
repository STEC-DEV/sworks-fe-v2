import CustomCard from "@/components/common/card";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import IconButton from "@/components/common/icon-button";

import { ScrollText } from "lucide-react";
import { format } from "date-fns";
import React from "react";
import { ContractInfo } from "@/types/admin/workplace/contract-info";

const mockData: ContractInfo[] = [
  {
    contractSeq: 42,
    contractTypeSeq: 26,
    contractTypeName: "시설",
    status: 1,
    contractAmount: 0,
    contractStaff: "",
    startDt: new Date("2025-07-15"),
    endDt: null,
    contractManager: "",
    comments: "",
  },
  {
    contractSeq: 43,
    contractTypeSeq: 24,
    contractTypeName: "미화",
    status: 1,
    contractAmount: 0,
    contractStaff: "",
    startDt: new Date("2025-07-01"),
    endDt: null,
    contractManager: "",
    comments: "",
  },
];

const ContractInfoArea = () => {
  return (
    <CustomAccordion icon={ScrollText} label="계약정보">
      <div className="grid grid-cols-4 gap-6 px-6">
        {mockData.map((c, i) => (
          <ContractCard key={i} data={c} />
        ))}
      </div>
    </CustomAccordion>
  );
};

const ContractCard = ({ data }: { data: ContractInfo }) => {
  return (
    <CustomCard className="w-full items-end gap-0 py-4 ">
      <div className="flex gap-2">
        <IconButton size={16} icon="SquarePen" />
        <IconButton size={16} icon="Trash2" />
      </div>
      <div className="flex flex-col gap-4 w-full px-4">
        <span className="text-sm text-blue-500">{data.contractTypeName}</span>
        <div className="flex flex-col gap-2 justify-center">
          <KeyValue label={"담당자"} value={data.contractManager} />
          <KeyValue label={"계약인원"} value={data.contractStaff} />
          <KeyValue
            label={"계약일"}
            value={format(data.startDt, "yyyy-MM-dd")}
          />
          <KeyValue
            label={"해약일"}
            value={format(data.startDt, "yyyy-MM-dd")}
          />
          <KeyValue label={"계약금액"} value={data.contractAmount.toString()} />
        </div>
      </div>
    </CustomCard>
  );
};

interface KeyValueProps {
  label: string;
  value: string;
}

const KeyValue = ({ label, value }: KeyValueProps) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[var(--description-light)]">{label}</span>
      <span className="text-xs text-[var(--description-dark)] font-semibold">
        {value}
      </span>
    </div>
  );
};

export default ContractInfoArea;
