import {
  DivCodeType,
  ServiceType,
  TypeCodeType,
} from "@/types/common/basic-code";

export interface ChecklistMultiType extends ServiceType {
  divs: ChecklistDivType[];
}

export interface ChecklistDivType extends DivCodeType {
  types: TypeCodeType[];
}
