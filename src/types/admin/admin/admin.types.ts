export interface Admin {
  userSeq: number;
  userName: string | null;
  role: string;
  loginId: string;
  deptSeq: number;
  deptName: string;
  job: string | null;
  phone: string;
  email: string | null;
  images: string | null;
}

export interface LoginProfile {
  userSeq: number;
  userName: string | null;
  role: string;
  job: string | null;
  phone: string;
  email: string | null;
}
