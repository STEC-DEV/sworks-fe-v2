import { JWTPayload } from "@/middleware";
import { jwtVerify } from "jose";

export async function JWTVerified(accessToken: string): Promise<JWTPayload> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload }: { payload: JWTPayload } = await jwtVerify(
    accessToken,
    secret
  );

  return payload;
}
