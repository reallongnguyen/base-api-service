export interface SuccessResult<T> {
  err?: never;
  data: T;
}

export interface FailResult<T> {
  err: T;
  data?: never;
}

export type AppResult<T, K> = SuccessResult<T> | FailResult<K>;
