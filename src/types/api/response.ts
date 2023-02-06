export interface APIResponse<Data> {
    id?: string;
    error?: string;
    data?: Data;
  }