"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRSAKeys = generateRSAKeys;
exports.generateECCKeys = generateECCKeys;
exports.exportPublicKey = exportPublicKey;
exports.exportPrivateKey = exportPrivateKey;
exports.downloadPrivateKey = downloadPrivateKey;
function arrayBufferToPem(buffer, label) {
    const base64 = window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`;
}
async function generateRSAKeys() {
    const keyPair = await window.crypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
    }, true, ["sign", "verify"]);
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const privateKey = await exportPrivateKey(keyPair.privateKey);
    return { publicKey, privateKey };
}
async function generateECCKeys() {
    const keyPair = await window.crypto.subtle.generateKey({
        name: "ECDSA",
        namedCurve: "P-256",
    }, true, ["sign", "verify"]);
    const publicKey = await exportPublicKey(keyPair.publicKey);
    const privateKey = await exportPrivateKey(keyPair.privateKey);
    return { publicKey, privateKey };
}
async function exportPublicKey(key) {
    const exported = await window.crypto.subtle.exportKey("spki", key);
    return arrayBufferToPem(exported, "PUBLIC KEY");
}
async function exportPrivateKey(key) {
    const exported = await window.crypto.subtle.exportKey("pkcs8", key);
    return arrayBufferToPem(exported, "PRIVATE KEY");
}
async function downloadPrivateKey(key, filename) {
    const pem = await exportPrivateKey(key);
    const blob = new Blob([pem], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
}
//# sourceMappingURL=crypto.js.map