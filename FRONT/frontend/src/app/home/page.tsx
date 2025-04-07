"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [keyType, setKeyType] = useState<"rsa" | "ecc">("rsa");
  const router = useRouter();

  const handleGenerateKeys = async () => {
    alert(`Generar llaves ${keyType.toUpperCase()} (lógica pendiente)`);
    // acá se generaran  luega las llaves y:
    // - Descargar la privada
    // - Enviar la pública al backend
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

      {/* Acá irá lo de la subida de archivo, lista de archivos, etc. */}
    </div>
  );
}
