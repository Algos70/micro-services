﻿export interface ApiResponse<T> {
  status: Status;
  message: string | null;
  data: T | null;
}

export type Status = 'success' | 'error';
