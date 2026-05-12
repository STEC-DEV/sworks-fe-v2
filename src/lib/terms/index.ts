import { Languages, Term } from "@/types/common/term";
import { PRIVACY_TERMS_KO } from "./ko";
import { PRIVACY_TERMS_EN } from "./en";

export const PRIVACY_TERMS_MAP: Record<Languages, Term> = {
  한국어: PRIVACY_TERMS_KO,
  English: PRIVACY_TERMS_EN,
};
