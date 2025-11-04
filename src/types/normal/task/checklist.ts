export interface TaskChecklist {
  chkMainSeq: number;
  chkMainTitle: string;
  isMainStatus: boolean;
  subs: TaskChecklistSub[];
}

export interface TaskChecklistSub {
  chkSubSeq: number;
  chkSubTitle: string;
  isSubStatus: boolean;
}

export interface SelectTaskChecklist {
  chkMainSeq: number;
  chkMainTitle: string;
  chkSubs: SelectTaskChecklistSub[];
}

export interface SelectTaskChecklistSub {
  chkSubSeq: number;
  chkSubTitle: string;
}
