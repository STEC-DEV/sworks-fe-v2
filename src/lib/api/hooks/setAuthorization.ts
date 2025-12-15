import { BeforeRequestHook } from "ky";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/auth/auth-store";

const setAuthorizationHeader: BeforeRequestHook = (req) => {
  // req.headers.set("SiteSeq", enteredWorkplace.siteSeq.toString());
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    req.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  // 2. SiteSeq는 독립적으로 설정 (accessToken 없어도 설정됨)
  const { enteredWorkplace } = useAuthStore.getState();
  if (enteredWorkplace) {
    req.headers.set("SiteSeq", enteredWorkplace.siteSeq.toString());
  } else {
    req.headers.delete("SiteSeq");
  }
};

export default setAuthorizationHeader;
