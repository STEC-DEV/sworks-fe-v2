import { SelectOption } from "@/types/common/select-item";

export const convertKeyValueArrayToRecord = (data: SelectOption[]) => {
  const record: Record<string, any> = {};
  for (const item of data) {
    record[item.key] = item.value.toString();
  }

  return record;
};
