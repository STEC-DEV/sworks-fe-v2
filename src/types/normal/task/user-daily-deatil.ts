export interface UserDailyTaskDetail {
  userName: string;
  totalTaskCount: number;
  totalCompleteCount: number;
  tasks: UserDailyTaskDetailItem[];
}

export interface UserDailyTaskDetailItem {
  taskSeq: number;
  taskName: string;
  repeat: number;
  isComplete: boolean;
  logDetails: UserDailyTaskDetailItemLog[];
}

export interface UserDailyTaskDetailItemLog {
  logSeq: number;
  workDt: Date;
  issue: string | null;
  adminChkYn: false;
}
