import ky from "ky";

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  hooks: {
    beforeRequest: [(request) => {}],
  },
});

export default api;
