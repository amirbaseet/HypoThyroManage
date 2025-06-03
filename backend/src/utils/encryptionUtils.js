/**
 * Encryption Utilities Module
 * 
 * Provides hybrid encryption functions:
 * - RSA key generation, AES key generation
 * - AES encryption/decryption for messages
 * - RSA encryption/decryption for AES keys
 * 
 * Uses:
 * - AES-256-CBC for symmetric encryption
 * - RSA 2048-bit keys with OAEP padding for asymmetric encryption
 */
const NodeRSA = require("node-rsa");
const crypto = require("crypto");

/**
 * Generates an RSA key pair (2048 bits) using NodeRSA.
 * 
 * @returns {Object} An object containing:
 *   - {string} publicKey: The public key in PEM format.
 *   - {string} privateKey: The private key in PEM format.
 */

exports.generateRSAKeys = () =>{

    const key = NodeRSA({ b: 2048 });
    return{
        publicKey: key.exportKey("public"),
        privateKey: key.exportKey("private")
    };
};

/**
 * Generates a random 256-bit (32-byte) AES key in hexadecimal format.
 * 
 * @returns {string} The generated AES key as a hex string.
 */
exports.generateAESKey = ()=> {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Encrypts a plaintext message using AES-256-CBC.
 * 
 * @param {string} message - The plaintext message to encrypt.
 * @param {string} aesKey - The AES key in hex format.
 * @returns {string} The encrypted message, formatted as "iv:encryptedText" (both in hex).
 */
exports.encryptMessageAES = (message, aesKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(aesKey, "hex"), iv);
    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

/**
 * Decrypts a message encrypted with AES-256-CBC.
 * 
 * @param {string} encryptedMessage - The encrypted message in "iv:encryptedText" format (hex).
 * @param {string} aesKey - The AES key in hex format.
 * @returns {string} The decrypted plaintext message.
 */

exports.decryptMessageAES = (encryptedMessage, aesKey) => {
    const [iv, encrypted] = encryptedMessage.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(aesKey, "hex"), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

/**
 * Encrypts an AES key using an RSA public key (with OAEP padding).
 * 
 * @param {string} aesKey - The AES key in hex format.
 * @param {string} publicKey - The RSA public key in PEM format.
 * @returns {string} The AES key encrypted with the RSA public key (Base64 encoded).
 * @throws {Error} If encryption fails.
 */

exports.encryptAESKeyWithRSA = (aesKey, publicKey) => {
    try {
        // console.log("🔹 Encrypting AES Key with RSA...");
        const key = new NodeRSA(publicKey, "public");
        key.setOptions({ encryptionScheme: "pkcs1_oaep" }); // ✅ Ensure OAEP padding
        return key.encrypt(aesKey, "base64");
    } catch (error) {
        console.error("❌ RSA Encryption Failed:", error);
        throw new Error("RSA encryption failed");
    }
};

/**
 * Decrypts an AES key using an RSA private key (with OAEP padding).
 * 
 * @param {string} encryptedAESKey - The AES key encrypted with RSA (Base64 encoded).
 * @param {string} privateKey - The RSA private key in PEM format.
 * @returns {string} The decrypted AES key in hex format.
 * @throws {Error} If decryption fails.
 */

exports.decryptAESKeyWithRSA = (encryptedAESKey, privateKey) => {
    try {
        // console.log("🔹 Decrypting AES Key with RSA...");
        const key = new NodeRSA(privateKey, "private");
        key.setOptions({ encryptionScheme: "pkcs1_oaep" }); // ✅ Ensure OAEP padding
        return key.decrypt(encryptedAESKey, "utf8");
    } catch (error) {
        console.error("❌ RSA Decryption Failed:", error);
        throw new Error("RSA decryption failed - Possible private key mismatch or encryption corruption.");
    }
};
