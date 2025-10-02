interface Task {
  taskSeq: number;
  repeat: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  termType: number; //0 - 매일, 1 - 특정일, 2 - 기간
  startDt: Date;
  endDt?: Date;
  mains?: Checklist[];
  users: Worker[];
}

interface TaskDetail {
  taskSeq: number;
  repeats: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  termType: number; //0 - 매일, 1 - 특정일, 2 - 기간
  startDt: Date;
  endDt?: Date;
  mains: Checklist[];
  users: Worker[];
}

interface Worker {
  userSeq: number;
  userName: string;
  phone?: string;
  serviceTypeSeq: number;
  serviceTypeName: number;
}

interface ClassificationTaskWorker {
  userSeq: number;
  userName: string;
  serviceTypeName: string;
  sabun: string;
  isStatus: boolean;
}
