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
