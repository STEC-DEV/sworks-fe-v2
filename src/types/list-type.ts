export type ListData<T> = {
  data: T[];
  meta: ListMeta;
};

export type ListState<T> =
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "data"; payload: ListData<T> };

export interface ListMeta {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}
