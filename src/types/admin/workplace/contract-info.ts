export interface Contract {
  contractSeq: number;
  contractTypeSeq: number;
  contractTypeName: string;
  status: boolean;
  //금액
  contractAmount?: number;
  //직원수
  contractStaff?: string;
  startDt: Date;
  endDt?: Date | null;
  //계약담당
  contractManager?: string;
  comments?: string;
}
