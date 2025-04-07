"use client";

import { useEffect, useState } from "react";
import { uploadFile, getFiles, downloadFile, verifyFile } from "@/services/api";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [sign, setSign] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const result = await getFiles();
      setFiles(result);
    } catch (error) {
      console.error("Error al obtener archivos:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handlePrivateKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPrivateKey(reader.result);
      }
    };
    if (e.target.files?.[0]) {
      reader.readAsText(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Selecciona un archivo");
    setLoading(true);

    let signature: string | undefined = undefined;

    if (sign && privateKey) {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

      try {
        const importedKey = await crypto.subtle.importKey(
          "pkcs8",
          strToArrayBuffer(privateKey),
          {
            name: "RSASSA-PKCS1-v1_5",
            hash: "SHA-256",
          },
          false,
          ["sign"]
        );

        const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", importedKey, hashBuffer);
        signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
      } catch (err) {
        console.error("Error al firmar:", err);
        alert("Error al firmar el archivo");
        setLoading(false);
        return;
      }
    }

    try {
      await uploadFile(file, signature);
      alert("Archivo subido correctamente");
      setFile(null);
      fetchFiles();
    } catch (err) {
      console.error(err);
      alert("Error al subir archivo");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const blob = await downloadFile(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "archivo_descargado";
      link.click();
    } catch (err) {
      console.error("Error al descargar archivo:", err);
      alert("Error al descargar archivo");
    }
  };

  const handleVerify = async (id: string, publicKey: string) => {
    try {
      const result = await verifyFile(id, publicKey);
      alert(result.valid ? "Firma válida ✅" : "Firma inválida ❌");
    } catch (err) {
      console.error("Error al verificar:", err);
      alert("Error al verificar la firma");
    }
  };

  const strToArrayBuffer = (pem: string): ArrayBuffer => {
    const b64 = pem.replace(/-----(BEGIN|END) PRIVATE KEY-----|\n/g, "");
    const binary = atob(b64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return buffer.buffer;
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md border p-4 rounded">
      <h2 className="text-xl font-bold">Subir archivo</h2>
      <input type="file" onChange={handleFileChange} />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={sign}
          onChange={(e) => setSign(e.target.checked)}
        />
        Firmar con clave privada
      </label>

      {sign && (
        <input type="file" accept=".pem" onChange={handlePrivateKeyUpload} />
      )}

      <button
        className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        disabled={loading}
        onClick={handleUpload}
      >
        {loading ? "Subiendo..." : "Subir"}
      </button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Archivos disponibles</h3>
        {files.length === 0 ? (
          <p className="text-sm text-gray-500">No hay archivos disponibles.</p>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => (
              <li key={file.id} className="flex justify-between items-center border p-2 rounded">
                <span>{file.nombre}</span>
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDownload(file.id)}
                  >
                    Descargar
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleVerify(file.id, file.publicKey)}
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
