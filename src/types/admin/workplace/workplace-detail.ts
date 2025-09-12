export interface WorkplaceDetail {
  siteSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  siteName: string;
  siteTel: string;
  siteAddress: string;
}

export interface UserWorkplaceDetail {
  siteSeq: number;
  siteName: string;
  contracts: UserServiceType[];
}

export interface UserServiceType {
  userServiceTypeSeq: number;
  userServiceTypeName: string;
}
