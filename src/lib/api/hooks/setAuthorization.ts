import { BeforeRequestHook } from "ky";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth/auth-store";

const setAuthorizationHeader: BeforeRequestHook = (req) => {
  const accessToken = Cookies.get("accessToken");
  const { enteredWorkplace } = useAuthStore.getState();

  if (!accessToken) return;
  req.headers.set("Authorization", `Bearer ${accessToken}`);
  if (!enteredWorkplace) return;
  req.headers.set("SiteSeq", enteredWorkplace.siteSeq.toString());
};

export default setAuthorizationHeader;
