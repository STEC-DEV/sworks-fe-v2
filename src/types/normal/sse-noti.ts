export interface SSENotification {
  topic: string;
  eventName: string;
  logSeq: string;
  title: string;
  message: string;
  notificationSeq: number;
  timestamp: Date;
}
