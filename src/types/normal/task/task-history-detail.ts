export interface TaskHistory {
  historySeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  repeat: number;
  users: TaskHistoryWorker[];
}

export interface TaskHistoryWorker {
  userSeq: number;
  userName: string;
  logs: TaskHistoryLog[];
}

interface TaskHistoryLog {
  logSeq: number;
  userWorkDt: Date;
  issue: string | null;
  attaches: LogAttaches[];
}

interface LogAttaches {
  logAttachSeq: number;
  logPath: string;
}
