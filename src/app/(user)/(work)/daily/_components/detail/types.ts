export interface NormalizedLog {
  logSeq: number;
  date: Date;
  issue: string | null;
  attachPaths: string[];
}

export interface PanelItem {
  id: number;
  label: string;
  isDone: boolean;
  current: number;
  total: number;
}

export interface StatItem {
  label: string;
  value: number;
  unit: string;
  color?: "primary" | "green" | "orange";
  showBar?: boolean;
}
