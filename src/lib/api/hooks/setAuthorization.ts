import { BeforeRequestHook } from "ky";
import Cookies from "js-cookie";

const setAuthorizationHeader: BeforeRequestHook = (req) => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) return;
  req.headers.set("Authorization", `Bearer ${accessToken}`);
};

export default setAuthorizationHeader;
