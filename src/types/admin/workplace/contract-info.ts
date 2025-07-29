export interface ContractInfo {
  contractSeq: number;
  contractTypeSeq: number;
  contractTypeName: string;
  status: number;
  contractAmount: number;
  contractStaff: string;
  startDt: Date;
  endDt?: Date | null;
  contractManager: string;
  comments: string;
}
