interface RequestListItem {
  requestSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  title: string;
  description: string;
  userSeq: number;
  userName: string;
  status: number; // 0 미처리, 1 처리중, 2 처리완료
  createDt: Date;
  completeDt?: Date;
  durationTime?: string;
}
