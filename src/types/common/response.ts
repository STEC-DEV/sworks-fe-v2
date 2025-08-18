export interface Response<T> {
  message: string;
  data: T;
  code: number;
}

export interface ReturnToken {
  accessToken: string;
  refreshToken: string;
}
