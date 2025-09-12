// interface VocListItem {
//   VocSeq: number;
//   vocTypeSeq: number;
//   vocTypeName: string;
//   locationName: string;
//   serviceTypeSeq: number;
//   serviceTypeName: string;
//   writer: string;
//   phone: string;
//   title: string;
//   occurredDt: Date;
//   finishedDt?: Date;
//   duration?: string;
//   vocProcessStateSeq: number;
//   vocProcessStateName: string;
// }

interface VocListItem {
  logSeq: number;
  //true - 수기입력 , false - 모바일
  division: boolean;
  name: string;
  serviceTypeName: string;
  createUser: string;
  phone: string;
  title: string;
  createDt: Date;
  completeDt: Date | null;
  durationDt: string | null;
  //0 미처리,1,2 처리완료
  status: number;
}

// /** 100,101,102 임시사용 */
// interface VocProcessType {
//   vocProcessStateSeq: number;
//   vocProcessStateName: string;
// }

// interface VocType {
//   vocTypeSeq: number;
//   vocTypeName: string;
// }
