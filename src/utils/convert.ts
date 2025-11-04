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

/**
 * 객체를 FormData로 변환하는 함수
 * @param data - 변환할 객체
 * @param formData - FormData 인스턴스 (재귀 호출용)
 * @param parentKey - 부모 키 (재귀 호출용)
 */
export const objectToFormData = (
  data: any,
  formData: FormData = new FormData(),
  parentKey: string = ""
): FormData => {
  if (data === null || data === undefined) {
    return formData;
  }

  // //빈문자열은 그대로 빈문자열
  // if (data === "") {
  //   // 옵션 1: 빈 문자열 그대로 추가
  //   formData.append(parentKey, " ");
  //   return formData;

  //   // 옵션 2: 빈 문자열은 아예 보내지 않음
  //   // return formData;
  // }

  // Date 객체 처리
  if (data instanceof Date) {
    formData.append(parentKey, data.toISOString());
    return formData;
  }

  // File 객체 처리
  // if (data instanceof File) {
  //   formData.append(parentKey, data);
  //   return formData;
  // }
  // 배열 체크를 먼저!
  if (Array.isArray(data)) {
    console.log("배열이야");
    data.forEach((item, i) => {
      if (item instanceof File) {
        console.log(item);
        formData.append(`${parentKey}`, item);
        // 또는 formData.append(parentKey, item);
      } else {
        formData.append(`${parentKey}[${i}]`, item);
      }
    });
    return formData;
  }

  // Blob 객체 처리
  if (data instanceof Blob) {
    console.log("blob이야");
    formData.append(parentKey, data);
    return formData;
  }

  // 배열 처리
  if (Array.isArray(data)) {
    if (data.length === 0) {
      // 빈 배열 처리 (선택적)
      // formData.append(parentKey, "null");
    } else {
      data.forEach((item, index) => {
        const key = `${parentKey}[${index}]`;
        objectToFormData(item, formData, key);
      });
    }
    return formData;
  }

  // 객체 처리
  if (typeof data === "object") {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}.${key}` : key;
      objectToFormData(value, formData, formKey);
    });
    return formData;
  }

  // 원시 타입 처리 (string, number, boolean)
  formData.append(parentKey, String(data));
  return formData;
};
