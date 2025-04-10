export async function signWithPrivateKey(
    privateKeyPem: string,
    dataBuffer: ArrayBuffer,
    keyType: 'rsa' | 'ecc'
  ): Promise<string> {
    try {
      console.log("🔐 Iniciando firma...");
      console.log("📄 Tipo de clave:", keyType);
      console.log("📄 Clave privada (inicio):", privateKeyPem.slice(0, 100));
      console.log("📦 Tamaño del buffer a firmar:", dataBuffer.byteLength, "bytes");
  
      const binaryDer = pemToArrayBuffer(privateKeyPem);
      console.log("🧬 Clave privada convertida a ArrayBuffer:", binaryDer.byteLength, "bytes");
  
      const algorithm =
        keyType === 'rsa'
          ? { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }
          : { name: 'ECDSA', namedCurve: 'P-256' };
  
      const importedKey = await crypto.subtle.importKey(
        'pkcs8',
        binaryDer,
        algorithm,
        false,
        ['sign']
      );
      console.log("✅ Clave importada correctamente");
  
      const signAlgorithm =
        keyType === 'rsa' ? 'RSASSA-PKCS1-v1_5' : { name: 'ECDSA', hash: 'SHA-256' };
  
      const signatureBuffer = await crypto.subtle.sign(signAlgorithm, importedKey, dataBuffer);
  
      let signatureBase64;
  
      if (keyType === 'ecc') {
        // DER encode ECC signature (r + s)
        const sig = new Uint8Array(signatureBuffer);
        const r = sig.slice(0, sig.length / 2);
        const s = sig.slice(sig.length / 2);
  
        const encodeDER = (r: Uint8Array, s: Uint8Array) => {
          const toDER = (b: Uint8Array) => {
            if (b[0] & 0x80) b = new Uint8Array([0x00, ...b]);
            let i = 0;
            while (i < b.length - 1 && b[i] === 0 && (b[i + 1] & 0x80) === 0) i++;
            return b.slice(i);
          };
  
          const derR = toDER(r);
          const derS = toDER(s);
  
          const result = new Uint8Array(6 + derR.length + derS.length);
          let offset = 0;
          result[offset++] = 0x30;
          result[offset++] = 4 + derR.length + derS.length;
  
          result[offset++] = 0x02;
          result[offset++] = derR.length;
          result.set(derR, offset);
          offset += derR.length;
  
          result[offset++] = 0x02;
          result[offset++] = derS.length;
          result.set(derS, offset);
  
          return result;
        };
  
        const derEncoded = encodeDER(r, s);
        signatureBase64 = btoa(String.fromCharCode(...derEncoded));
      } else {
        signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
      }
  
      console.log("🖋️ Firma generada con éxito (inicio base64):", signatureBase64.slice(0, 80));
      console.log("🖋️ Longitud de firma:", signatureBuffer.byteLength, "bytes");
  
      return signatureBase64;
    } catch (error) {
      console.error("❌ Error al firmar:", error);
      throw new Error("Falló la generación de la firma");
    }
  }
  
  function pemToArrayBuffer(pem: string): ArrayBuffer {
    const b64 = pem
      .replace(/-----BEGIN PRIVATE KEY-----/, '')
      .replace(/-----END PRIVATE KEY-----/, '')
      .replace(/\s/g, '');
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
  }
  