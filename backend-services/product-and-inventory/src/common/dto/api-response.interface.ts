export interface ApiResponseInterface<T> {
  status: Status;
  message: string | null;
  data: T | null;
  event: string;
}

export type Status = 'success' | 'error';
