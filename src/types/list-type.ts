export type ListState<T> =
  | { type: "loading" }
  | { type: "error"; error: string }
  | { type: "data"; data: T[]; meta: ListMeta };

export interface ListMeta {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}
