import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const algorithm = "aes-256-cbc";
const key = process.env.ENCRYPTION_KEY;

if (!key || key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be exactly 32 characters long");
}

export function encrypt(text: string): { encryptedData: string; iv: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
  };
}

export function decrypt(encryptedData: string, iv: string): string {
  const decipher = createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
