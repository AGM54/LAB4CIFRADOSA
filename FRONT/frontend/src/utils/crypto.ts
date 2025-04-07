// src/utils/crypto.ts

export async function generateKeyPair(algo: "rsa" | "ecc") {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Web Crypto API no soportada");
    }
  
    if (algo === "rsa") {
      return window.crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      );
    } else {
      return window.crypto.subtle.generateKey(
        {
          name: "ECDSA",
          namedCurve: "P-256",
        },
        true,
        ["sign", "verify"]
      );
    }
  }
  
  export async function exportKey(key: CryptoKey): Promise<string> {
    const exported = await window.crypto.subtle.exportKey("pkcs8" in key ? "pkcs8" : "spki", key);
    const buffer = new Uint8Array(exported);
    return btoa(String.fromCharCode(...buffer));
  }
  
  export async function downloadPrivateKey(key: CryptoKey, filename: string) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", key);
    const blob = new Blob([exported], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
  }
  //com