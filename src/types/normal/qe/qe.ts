export interface QeListItem {
  logSeq: number;
  serviceTypeSeq: number;
  serviceTypeName: string;
  divCodeSeq: number;
  divCodeName: string;
  typeCodeSeq: number;
  typeCodeName: string;
  createDt: string;
  createUser: string;
  score: string;
}

export interface EvaluateListItem {
  serviceTypeSeq: number;
  serviceTypeName: string;
  divCodeSeq: number;
  divCodeName: string;
  typeCodeSeq: number;
  typeCodeName: string;
}
