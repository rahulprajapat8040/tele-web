export interface IApiResponse<T> {
  message: string;
  status: number;
  success: boolean;
  data: T;
}

export interface IPageInfo {
  total: number;
  page: number;
  totalPage: number;
  limit: number;
}

export interface ISearchParam {
  page: number;
  limit: number;
  search?: string;
  role?: string;
}

export interface ICursorRes {
  nextCursor: string | null;
  hasMore: boolean;
}
