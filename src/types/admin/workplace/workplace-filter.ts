/**
 * 계약유형
 * --
 */
export const ContractServiceType = {
  미화: "24",
  보안: "25",
  시설: "26",
  방제: "27",
  기타: "28",
};

export type ContractServiceType =
  (typeof ContractServiceType)[keyof typeof ContractServiceType];

/**
 * 계약유형
 * --
 */
export const DivType = {
  일반: "30",
  위험: "31",
  품질: "32",
};

export type DivType = (typeof DivType)[keyof typeof DivType];

/**
 * 관리 유형
 * --
 */
export const SiteServiceType = {
  공통: "34",
  빌딩: "35",
  병원: "36",
  대학교: "37",
  아파트: "38",
  메트로: "39",
  공장: "40",
};

export type SiteServiceType =
  (typeof ContractServiceType)[keyof typeof ContractServiceType];
