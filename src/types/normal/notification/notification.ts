//0 - voc , 1 - 공지사항, 2 - 업무요청, 3 - 스케줄

export interface Notification {
  notificationSeq: number;
  notiType: number;
  title: string;
  contents: string;
  originSeq: number;
  createDt: Date;
  readSignSeq: number;
  isRead: boolean;
}

export interface NotiResponse {
  items: Notification[];
  lastCursor: number;
  hasMore: boolean;
}
