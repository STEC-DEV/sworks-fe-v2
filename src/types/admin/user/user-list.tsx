export interface AdminListItem {
  id: number;
  name: string;
  permission: "System Admin" | "Master" | "Manager";
  job: string;
  phone: string;
  department: Department;
}

export interface AdminList {
  userSeq: number;
  userTypeSeq: number;
  userTypeName: string;
  userName: string;
  phone: string;
  deptSeq: number;
  deptName: string;
}

export interface Department {
  id: number;
  name: string;
}

export const mockAdminList: AdminListItem[] = [
  {
    id: 1,
    name: "김민수",
    permission: "System Admin",
    job: "부장",
    phone: "010-1234-1001",
    department: { id: 1, name: "정보보안팀" },
  },
  {
    id: 2,
    name: "이영희",
    permission: "Manager",
    job: "차장",
    phone: "010-1234-1002",
    department: { id: 2, name: "재무팀" },
  },
  {
    id: 3,
    name: "박지훈",
    permission: "Master",
    job: "차장",
    phone: "010-1234-1003",
    department: { id: 3, name: "기획팀" },
  },
  {
    id: 4,
    name: "최은지",
    permission: "Manager",
    job: "차장",
    phone: "010-1234-1004",
    department: { id: 4, name: "마케팅팀" },
  },
  {
    id: 5,
    name: "정우성",
    permission: "System Admin",
    job: "차장",
    phone: "010-1234-1005",
    department: { id: 1, name: "정보보안팀" },
  },
  {
    id: 6,
    name: "김서연",
    permission: "Master",
    job: "차장",
    phone: "010-1234-1006",
    department: { id: 5, name: "인사팀" },
  },
  {
    id: 7,
    name: "한지민",
    permission: "Manager",
    job: "과장",
    phone: "010-1234-1007",
    department: { id: 6, name: "디자인팀" },
  },
  {
    id: 8,
    name: "오준호",
    permission: "System Admin",
    job: "과장",
    phone: "010-1234-1008",
    department: { id: 1, name: "정보보안팀" },
  },
  {
    id: 9,
    name: "서지수",
    permission: "Master",
    job: "과장",
    phone: "010-1234-1009",
    department: { id: 7, name: "교육팀" },
  },
  {
    id: 10,
    name: "이재훈",
    permission: "Manager",
    job: "과장",
    phone: "010-1234-1010",
    department: { id: 8, name: "운영팀" },
  },
  {
    id: 11,
    name: "홍유나",
    permission: "Manager",
    job: "과장",
    phone: "010-1234-1011",
    department: { id: 9, name: "법무팀" },
  },
  {
    id: 12,
    name: "배성우",
    permission: "System Admin",
    job: "과장",
    phone: "010-1234-1012",
    department: { id: 1, name: "정보보안팀" },
  },
  {
    id: 13,
    name: "문하늘",
    permission: "Master",
    job: "과장",
    phone: "010-1234-1013",
    department: { id: 10, name: "데이터팀" },
  },
  {
    id: 14,
    name: "장예린",
    permission: "Manager",
    job: "과장",
    phone: "010-1234-1014",
    department: { id: 11, name: "고객지원팀" },
  },
  {
    id: 15,
    name: "김현우",
    permission: "Master",
    job: "대리",
    phone: "010-1234-1015",
    department: { id: 12, name: "개발팀" },
  },
  {
    id: 16,
    name: "조은별",
    permission: "Manager",
    job: "대리",
    phone: "010-1234-1016",
    department: { id: 12, name: "개발팀" },
  },
  {
    id: 17,
    name: "이도윤",
    permission: "System Admin",
    job: "대리",
    phone: "010-1234-1017",
    department: { id: 1, name: "정보보안팀" },
  },
  {
    id: 18,
    name: "정다운",
    permission: "Master",
    job: "사원",
    phone: "010-1234-1018",
    department: { id: 13, name: "총무팀" },
  },
  {
    id: 19,
    name: "노지훈",
    permission: "Manager",
    job: "사원",
    phone: "010-1234-1019",
    department: { id: 14, name: "품질관리팀" },
  },
  {
    id: 20,
    name: "유세린",
    permission: "Master",
    job: "사원",
    phone: "010-1234-1020",
    department: { id: 6, name: "디자인팀" },
  },
];
