interface Task {
  taskSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  termType: number;
  startDt: Date;
  endDt?: Date;
  workDt: Date;
  users: Worker[];
}

interface Worker {
  userSeq: number;
  userName: string;
  counts: number;
  repeats: number;
}
