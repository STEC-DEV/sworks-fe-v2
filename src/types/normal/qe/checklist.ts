export interface QeChecklist {
  siteSeq: number;
  siteName: string;
  serviceTypeSeq: number;
  serviceTypeName: string;
  divCodeSeq: number;
  divCodeName: string;
  typeCodeSeq: number;
  typeCodeName: string;
  mains: QeMain[];
}

export interface QeEditChecklist {
  logSeq: number;
  siteSeq: number;
  siteName: string;
  serviceTypeSeq: number;
  serviceTypeName: string;
  divCodeSeq: number;
  divCodeName: string;
  typeCodeSeq: number;
  typeCodeName: string;
  mains: QeMain[];
}

export interface QeViewChecklist {
  logSeq: number;
  siteSeq: number;
  siteName: string;
  serviceTypeSeq: number;
  serviceTypeName: string;
  divCodeSeq: number;
  divCodeName: string;
  typeCodeSeq: number;
  typeCodeName: string;
  totalScore: string;
  createUser: string;
  createDt: Date;
  mains: QeViewMain[];
}

export interface QeMain {
  chkMainSeq: number;
  chkMainTitle: string;
  chkMainSumYn: boolean;
  chkMainTotal: number;
  subs: QeSub[];
}

export interface QeViewMain {
  chkMainSeq: number;
  chkMainTitle: string;
  chkMainSumYn: boolean;
  chkMainTotalScore: number;
  chkMainTotalPoint: number;
  subs: QeSub[];
}

export interface QeSub {
  chkSubSeq: number;
  chkSubTitle: string;
  chkSubSumYn: boolean;
  chkSubTotal: number;
  details: QeDetail[];
}

export interface QeDetail {
  chkDetailSeq: number;
  chkDetailTitle: string;
  chkDetailItem: string;
  score?: number | undefined;
  chkPoint: number;
}
