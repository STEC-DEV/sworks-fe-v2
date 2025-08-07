export interface AdminListItem {
  userSeq: number;
  userName: string;
  phone: string;
  job: string;
  role: string;
  deptSeq: number;
  deptName: string;
}

export interface SelectAdminList {
  userSeq: number;
  userName: string;
  phone: string;
  job: string;
  role: string;
  deptSeq: number;
  deptName: string;
  isAdminSite: boolean;
}

export const mockAdminList: AdminListItem[] = [
  {
    userSeq: 1,
    userName: "김용우",
    role: "마스터",
    job: "마스터",
    phone: "123123",
    deptSeq: 1,
    deptName: "시스템개발연구소",
  },
  {
    userSeq: 2,
    userName: "이현성",
    role: "마스터",
    job: "마스터",
    phone: "123123",
    deptSeq: 1,
    deptName: "시스템개발연구소",
  },
  {
    userSeq: 7,
    userName: "시스템관리자",
    role: "시스템관리자",
    job: "시스템관리자",
    phone: "123-23",
    deptSeq: 1,
    deptName: "시스템개발연구소",
  },
  {
    userSeq: 8,
    userName: "매니저",
    role: "매니저",
    job: "매니저",
    phone: "010-1234-5678",
    deptSeq: 1,
    deptName: "시스템개발연구소",
  },
];
