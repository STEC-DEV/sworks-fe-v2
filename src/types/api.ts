export interface CustomResponseType<T> {
  code: number;
  data: T;
  message: string;
}
