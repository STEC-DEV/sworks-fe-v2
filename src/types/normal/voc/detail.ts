interface VocDetail {
  logs: LogInfo;
  replys: VocReply[];
}

interface LogInfo {
  logSeq: number;
  serviceTypeName: string;
  serviceTypeSeq: number;
  createUser: string;
  title: string;
  content: string;
  phone: string;
  replyYn: boolean;
  attaches: Attach[];
}

interface VocReply {
  replySeq: number;
  status: number;
  content: string;
  createUser: string;
  createDt: Date;
  attaches: Attach[];
}

interface Attach {
  attachSeq: number;
  path: string;
  fileName: string;
  ext: string;
  length: number;
}
