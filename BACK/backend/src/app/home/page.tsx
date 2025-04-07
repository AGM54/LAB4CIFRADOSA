"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRSAKeys, generateECCKeys } from "@/utils/crypto";

export default function HomePage() {
  const [keyType, setKeyType] = useState<"rsa" | "ecc">("rsa");
  const router = useRouter();

  const handleGenerateKeys = async () => {
    try {
      let publicKey = "";
      let privateKey = "";

      if (keyType === "rsa") {
        const keys = await generateRSAKeys();
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
      } else {
        const keys = await generateECCKeys();
        publicKey = keys.publicKey;
        privateKey = keys.privateKey;
      }

      // Descargar privada
      const blob = new Blob([privateKey], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `private_key_${keyType}.pem`;
      link.click();

      // Enviar pública al backend
      await fetch("/api/publickey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey, type: keyType }),
      });

      alert("Llaves generadas y enviada la pública correctamente");
    } catch (err) {
      console.error("Error generando llaves:", err);
      alert("Ocurrió un error generando las llaves");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Bienvenido a tu panel</h1>

      {/* Selección tipo de llave */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Tipo de clave:</label>
        <select
          value={keyType}
          onChange={(e) => setKeyType(e.target.value as "rsa" | "ecc")}
          className="border p-2 rounded"
        >
          <option value="rsa">RSA</option>
          <option value="ecc">ECC</option>
        </select>
      </div>

      {/* Botón para generar llaves */}
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handleGenerateKeys}
      >
        Generar llaves {keyType.toUpperCase()}
      </button>

      {/* Aquí después irá subida de archivos y más cosas */}
    </div>
  );
}
