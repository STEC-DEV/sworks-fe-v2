import { CheckItemWrapper } from "@/app/admin/checklist/[id]/_components/chk-accordion";
import CustomAccordion from "@/components/common/accordion/custom-accordion";
import { CircleCheckBig } from "lucide-react";

const ChkAccordion = ({ data }: { data: Checklist }) => {
  return (
    <CustomAccordion label={data.chkMainTitle} icon={CircleCheckBig}>
      {data.subs.map((v, i) => (
        <CheckItemWrapper key={i} data={v} />
      ))}
    </CustomAccordion>
  );
};

export default ChkAccordion;
