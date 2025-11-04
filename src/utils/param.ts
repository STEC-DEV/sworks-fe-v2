export const paramsCheck = (params: URLSearchParams): URLSearchParams => {
  if (params.size === 0) {
    params.set("pageNumber", "1");
    params.set("pageSize", "20");
  }

  if (!params.get("pageNumber")) {
    params.set("pageNumber", "1");
  }

  if (!params.get("pageSize")) {
    params.set("pageSize", "20");
  }

  return params;
};
