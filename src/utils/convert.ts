import { SelectOption } from "@/types/common/select-item";
import { format } from "date-fns";

/**
 * select 배열형태를 record 객체로 변환
 * --
 * @param data
 * @returns
 */
export const convertKeyValueArrayToRecord = (data: SelectOption[]) => {
  const record: Record<string, any> = {};
  for (const item of data) {
    record[item.key] = item.value.toString();
  }

  return record;
};

/**
 * 일반적인 {label : 기계, value:1}의 배열 형태를 select 컴포넌트에 담을수있는 형태로 변환
 * --
 * @param arrayItems
 * @returns
 */
export const convertSelectOptionType = (arrayItems: Array<any>) => {
  const selectOptions: SelectOption[] = [];

  arrayItems.forEach((arr) => {
    const keys = Object.keys(arr);
    selectOptions.push({ key: arr[keys[1]], value: parseInt(arr[keys[0]]) });
  });

  return selectOptions;
};

/**
 * 일반적인 zod 데이터를 formdata형태로 변환하는 유틸리티
 * @param data
 */
export const convertRecordDataToFormData = (
  data: Record<string, any>,
  dateOnly: boolean = false
) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    console.log(`${key} : ${value}`);
    if (value instanceof Date) {
      const dateValue = dateOnly
        ? value.toISOString().split("T")[0] // "2025-08-21"
        : value.toISOString();

      formData.append(key, dateValue);
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      if (
        value.length > 0 &&
        typeof value[0] === "object" &&
        !(value[0] instanceof File)
      ) {
        formData.append(key, JSON.stringify(value));
      } else {
        //파일의 경우
        value.forEach((item) => {
          if (item instanceof File) {
            formData.append(key, item);
          } else {
            formData.append(key, item);
          }
        });
      }
    } else if (typeof value === "object" && value !== null) {
      const isEmpty = Object.keys(value).length === 0;
      // 단일 객체인 경우 JSON 문자열로 변환
      if (!isEmpty) formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  console.log(formData);

  return formData;
};
