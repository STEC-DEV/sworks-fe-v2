export interface BasicCode {
  codeSeq: number;
  codeName: string;
}

export type BasicCodeCategory =
  | "contractCodes"
  | "divCodes"
  | "hcCodes"
  | "managerCodes"
  | "mnoCodes"
  | "mroCodes"
  | "pumpCodes"
  | "rnmCodes"
  | "typeCodes"
  | "userCodes";

export type BasicCodeType = Partial<Record<BasicCodeCategory, BasicCode[]>>;

export interface ContractType {
  contractTypeSeq: number;
  contractTypeName: string;
}

export interface ServiceType {
  serviceTypeSeq: number;
  serviceTypeName: string;
}

export interface DivCodeType {
  divCodeSeq: number;
  divCodeName: string;
}

export interface TypeCodeType {
  typeCodeSeq: number;
  typeCodeName: string;
}

export interface UserServiceType {
  userServiceTypeSeq: number;
  userServiceTypeName: string;
}

export const ProcessStatus = [
  {
    value: 0,
    name: "미처리",
  },
  {
    value: 1,
    name: "처리중",
  },
  {
    value: 2,
    name: "처리완료",
  },
];
