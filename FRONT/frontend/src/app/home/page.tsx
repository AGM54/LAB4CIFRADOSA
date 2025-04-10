"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateRSAKeys, generateECCKeys } from "@/utils/crypto";
import { savePublicKey } from "@/services/api";
import FileUploader from "./components/FileUploader"; // ✅ Agregado

export default function HomePage() {
  const [keyType, setKeyType] = useState<"rsa" | "ecc">("rsa");
  const router = useRouter();

  const handleGenerateKeys = async () => {
    try {
      let publicKey = "";
      let privateKey = "";

      // Generar llaves
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

      // Guardar pública en localStorage
      localStorage.setItem("publicKey", publicKey);

      // Enviar pública al backend
      await savePublicKey(publicKey);

      alert("Llaves generadas y pública enviada correctamente");
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

      {/* ✅ Subida y verificación de archivos */}
      <FileUploader keyType={keyType} />
    </div>
  );
}
