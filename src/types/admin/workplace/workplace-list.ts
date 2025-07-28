export interface WorkplaceListItem {
  siteSeq: number;
  siteName: string;
  siteAddress: string;
  siteTel: string;
  //계약정보
  contracts?: ContractInfo[];
}

//계약정보(임시)
export interface ContractInfo {
  serviceTypeName: "미화" | "보안" | "설비" | "기타";
}
