interface ChecklistDetail {
  serviceTypeSeq: number;
  serviceTypeName: string;
  divCodeSeq: number;
  divCodeName: string;
  typeCodeSeq: number;
  typeCodeName: string;
  mains: Checklist[];
}

//체크리스트 최상위 항목
interface Checklist {
  chkMainSeq: number;
  chkMainTitle: string;
  sumYn: boolean;
  subs: ChecklistItem[];
}

//체크리스트 세부항목
interface ChecklistItem {
  chkSubSeq: number;
  chkSubTitle: string;
  sumYn: boolean;
  details: ChecklistItemDetail[];
}

//체크리스트 세부항목 상세
interface ChecklistItemDetail {
  chkDetailSeq: number;
  chkDetailTitle: string;
  chkItem: string;
  chkPoint: number;
}
