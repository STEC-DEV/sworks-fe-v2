import { SelectTaskChecklist } from "./checklist";

export interface CreateTask {
  siteSeq: number;
  serviceTypeSeq?: number;
  title: string;
  startDt: Date;
  endDt?: Date | null;
  termType: number;
  repeat: number;
  //체크리스트
  chkMains: SelectTaskChecklist[];
}
