export function formatPagination<T = any>(
  rows: T[],
  total: number,
  pageNum: number = 1,
  pageSize: number = 20,
) {
  return {
    page: Number(pageNum),
    list: rows,
    total: Number(total),
    pageSize: Number(pageSize),
  };
}
