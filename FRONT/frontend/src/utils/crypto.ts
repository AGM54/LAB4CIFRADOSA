// src/utils/crypto.ts

function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
  const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}

// Generar par de claves RSA
export async function generateRSAKeys(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );

  const publicKey = await exportPublicKey(keyPair.publicKey);
  const privateKey = await exportPrivateKey(keyPair.privateKey);
  return { publicKey, privateKey };
}

// Generar par de claves ECC
export async function generateECCKeys(): Promise<{ publicKey: string; privateKey: string }> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"]
  );

  const publicKey = await exportPublicKey(keyPair.publicKey);
  const privateKey = await exportPrivateKey(keyPair.privateKey);
  return { publicKey, privateKey };
}

// Exportar clave pública a PEM
export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  return arrayBufferToPem(exported, "PUBLIC KEY");
}

// Exportar clave privada a PEM
export async function exportPrivateKey(key: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  return arrayBufferToPem(exported, "PRIVATE KEY");
}

// Descargar la clave privada como archivo .pem
export async function downloadPrivateKey(key: CryptoKey, filename: string): Promise<void> {
  const pem = await exportPrivateKey(key);
  const blob = new Blob([pem], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}
