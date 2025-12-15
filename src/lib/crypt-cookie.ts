const SECRET_KEY = process.env.NEXT_PUBLIC_COOKIE_SECRET || "dkssudgktpdy";

export function encryptCookie(value: string): string {
  const secretBytes = new TextEncoder().encode(SECRET_KEY);
  const valueBytes = new TextEncoder().encode(value);

  // XOR 암호화
  const encrypted = new Uint8Array(valueBytes.length);
  for (let i = 0; i < valueBytes.length; i++) {
    encrypted[i] = valueBytes[i] ^ secretBytes[i % secretBytes.length];
  }

  // Base64 인코딩
  return Buffer.from(encrypted).toString("base64");
}

export function decryptCookie(encrypted: string): string | null {
  try {
    const secretBytes = new TextEncoder().encode(SECRET_KEY);

    // Base64 디코딩
    const encryptedBytes = new Uint8Array(Buffer.from(encrypted, "base64"));

    // XOR 복호화
    const decrypted = new Uint8Array(encryptedBytes.length);
    for (let i = 0; i < encryptedBytes.length; i++) {
      decrypted[i] = encryptedBytes[i] ^ secretBytes[i % secretBytes.length];
    }

    // UTF-8로 디코딩
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decrypt error:", error);
    return null;
  }
}
