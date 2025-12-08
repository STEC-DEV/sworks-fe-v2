import { Attach } from "@/types/common/file";

export interface Request {
  requestSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  description: string;
  userSeq: number;
  userName: string;
  status: number;
  attaches: Attach[];
  logs: RequestLog[];
}

export interface RequestLog {
  logSeq: number;
  logContents: string;
  logWorkDt: Date;
  logStatus: number;
  createUserSeq: number;
  createUserName: string;
  attaches: Attach[];
  users: RequestLogUser[];
}

interface RequestLogUser {
  managerSeq: number;
  managerName: string;
}

//처리담당자
export interface RequestWorker {
  userSeq: number;
  userName: string;
  serviceTypeSeq: number;
  serviceTypeName: string;
  isManager: boolean;
}
