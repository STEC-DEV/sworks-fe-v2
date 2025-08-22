export const paramsCheck = (params: URLSearchParams): URLSearchParams => {
  if (
    params.size === 0 ||
    !params.get("pageNumber") ||
    !params.get("pageSize")
  ) {
    params.set("pageNumber", "1");
    params.set("pageSize", "20");
  }

  return params;
};
