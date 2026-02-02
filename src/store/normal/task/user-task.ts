export interface UserTask {
  userSeq: number;
  userName: string;
  total: number;
  complete: number;
  percent: number;
  tasks: UserTaskItem[];
}

export interface UserTaskItem {
  taskSeq: number;
  title: string;
  repeat: number;
  count: number;
}
