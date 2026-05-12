export interface TermSubSection {
  title: string;
  content: string | string[];
}

export interface TermSection {
  title: string;
  content: string;
  subSections?: TermSubSection[];
}

export interface Term {
  id: string;
  title: string;
  agreeLabel: string;
  isRequired: boolean;
  version: string;
  effectiveDate: string;
  sections: TermSection[];
}

export const LANGUAGES = ["한국어", "English"] as const;
export type Languages = (typeof LANGUAGES)[number];
