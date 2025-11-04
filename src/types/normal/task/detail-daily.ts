export interface DailyTask {
  taskSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  taskTitle: string;
  totalCount: number;
  users: Worker[];
}

export interface Worker {
  userSeq: number;
  userName: string;
  logs: Log[];
}

//로그에 작성시간 나와야함
export interface Log {
  logSeq: number;
  issue?: string;
  workDt: Date;
  attach: Attach[];
}

export interface Attach {
  attachSeq: number;
  images?: string;
}
