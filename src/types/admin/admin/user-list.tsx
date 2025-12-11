export interface AdminListItem {
  userSeq: number;
  userName: string;
  phone: string;
  job: string;
  role: string;
  deptSeq: number;
  sabun: string;
  deptName: string;
  images?: string | null;
}

export interface SelectAdminList {
  userSeq: number;
  userName: string;
  phone: string;
  job: string;
  role: string;
  sabun: string;
  deptSeq: number;
  deptName: string;
  isAdminSite: boolean;
}
