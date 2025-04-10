"use client";

import { useEffect, useState } from "react";
import {
  uploadFile,
  getFiles,
  downloadFile,
  verifyFile,
  FileMeta,
} from "@/services/api";
import { signWithPrivateKey } from "@/utils/signFile";

export default function FileUploader({ keyType }: { keyType: 'rsa' | 'ecc' }) {
  const [file, setFile] = useState<File | null>(null);
  const [sign, setSign] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileMeta[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const result = await getFiles();
      console.log("📦 Archivos obtenidos del backend:", result);
      setFiles(result);
    } catch (error: any) {
      console.error("❌ Error al obtener archivos:", error.response || error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      console.log("📄 Archivo seleccionado para subir:", selected.name);
      setFile(selected);
    }
  };

  const handlePrivateKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPrivateKey(reader.result);
        console.log("🔐 Clave privada cargada (inicio):", reader.result.slice(0, 80));
      }
    };
    if (e.target.files?.[0]) {
      console.log("📂 Archivo .pem seleccionado:", e.target.files[0].name);
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Selecciona un archivo");
      return;
    }

    setLoading(true);
    let signature: string | undefined = undefined;
    let hash: string | undefined = undefined;

    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log("📦 ArrayBuffer del archivo:", arrayBuffer.byteLength, "bytes");

      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      hash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("🔢 Hash SHA-256 generado:", hash);

      if (sign && privateKey) {
        console.log("✍️ Firmando usando clave:", keyType);
        const dataToSign = keyType === 'rsa' ? hashBuffer : arrayBuffer;
        signature = await signWithPrivateKey(privateKey, dataToSign, keyType);
        console.log("📌 Firma generada (inicio):", signature.slice(0, 80));
      }

      console.log("🚀 Subiendo archivo con hash y firma...");
      await uploadFile(file, signature, hash);
      alert("✅ Archivo subido correctamente");
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error("❌ Error al subir o firmar:", err);
      alert("Error al subir archivo");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      console.log("📥 Descargando archivo ID:", id);
      const blob = await downloadFile(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "archivo_descargado";
      link.click();
      console.log("✅ Archivo descargado");
    } catch (err) {
      console.error("❌ Error al descargar archivo:", err);
      alert("Error al descargar archivo");
    }
  };

  const handleVerify = async (id: number) => {
    try {
      const publicKey = localStorage.getItem("publicKey");
      if (!publicKey) {
        alert("No se encontró clave pública");
        return;
      }
      console.log("🔍 Verificando firma del archivo ID:", id);
      const result = await verifyFile(id, publicKey);
      console.log("🔎 Resultado de verificación:", result);
      alert(result.valid ? "Firma válida ✅" : "Firma inválida ❌");
    } catch (err) {
      console.error("❌ Error al verificar firma:", err);
      alert("Error al verificar la firma");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md border p-4 rounded bg-white shadow">
      <h2 className="text-xl font-bold text-center">Subir archivo</h2>

      <label className="font-medium">Selecciona un archivo:</label>
      <input
        type="file"
        className="p-1 border rounded"
        onChange={handleFileChange}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={sign}
          onChange={(e) => setSign(e.target.checked)}
        />
        Firmar con clave privada
      </label>

      {sign && (
        <>
          <label className="font-medium">Cargar clave privada (.pem)</label>
          <input
            type="file"
            accept=".pem"
            onChange={handlePrivateKeyUpload}
            className="p-1 border rounded"
          />
        </>
      )}

      <button
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
        onClick={handleUpload}
      >
        {loading ? "Subiendo..." : "Subir"}
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Archivos disponibles</h3>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No hay archivos disponibles.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{file.name}</span>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDownload(file.id)}
                  >
                    Descargar
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleVerify(file.id)}
                  >
                    Verificar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
