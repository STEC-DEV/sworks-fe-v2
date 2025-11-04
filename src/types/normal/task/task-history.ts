export interface TaskHistoryListItem {
  historySeq: number;
  taskSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  targetDt: Date;
  title: string;
  startDt: Date;
  endDt: Date | null;
  termType: number;
  repeat: number;
  users: TaskHistoryWorker[];
}

interface TaskHistoryWorker {
  userName: string;
  count: number;
}
