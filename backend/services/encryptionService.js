const crypto = require("crypto");
const NodeRSA = require("node-rsa");

// Generate a Secure AES-256 Key
const generateAESKey = () => crypto.randomBytes(32).toString("hex");

// Encrypt AES Key using Doctor/Patient Public Key
const encryptAESKey = (aesKey, publicKey) => {
    const rsa = new NodeRSA(publicKey);
    return rsa.encrypt(aesKey, "base64");
};

// Decrypt AES Key using Private Key
const decryptAESKey = (encryptedAES, privateKey) => {
    const rsa = new NodeRSA(privateKey);
    return rsa.decrypt(encryptedAES, "utf8");
};

module.exports = { generateAESKey, encryptAESKey, decryptAESKey };
