"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const crypto_1 = require("@/utils/crypto");
function HomePage() {
    const [keyType, setKeyType] = (0, react_1.useState)("rsa");
    const router = (0, navigation_1.useRouter)();
    const handleGenerateKeys = async () => {
        try {
            let publicKey = "";
            let privateKey = "";
            if (keyType === "rsa") {
                const keys = await (0, crypto_1.generateRSAKeys)();
                publicKey = keys.publicKey;
                privateKey = keys.privateKey;
            }
            else {
                const keys = await (0, crypto_1.generateECCKeys)();
                publicKey = keys.publicKey;
                privateKey = keys.privateKey;
            }
            const blob = new Blob([privateKey], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `private_key_${keyType}.pem`;
            link.click();
            await fetch("/api/publickey", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicKey, type: keyType }),
            });
            alert("Llaves generadas y enviada la pública correctamente");
        }
        catch (err) {
            console.error("Error generando llaves:", err);
            alert("Ocurrió un error generando las llaves");
        }
    };
    return (<div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">Bienvenido a tu panel</h1>

      
      <div className="flex items-center gap-4">
        <label className="font-medium">Tipo de clave:</label>
        <select value={keyType} onChange={(e) => setKeyType(e.target.value)} className="border p-2 rounded">
          <option value="rsa">RSA</option>
          <option value="ecc">ECC</option>
        </select>
      </div>

      
      <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleGenerateKeys}>
        Generar llaves {keyType.toUpperCase()}
      </button>

      
    </div>);
}
//# sourceMappingURL=page.js.map