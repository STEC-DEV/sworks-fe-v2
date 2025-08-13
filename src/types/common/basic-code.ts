interface BasicCode {
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
