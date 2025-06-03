/**
 * Crypto Utilities
 * 
 * This module provides helper functions for cryptographic operations such as key pair generation.
 */

const crypto = require("crypto");

/**
 * Generates a new RSA key pair asynchronously.
 * 
 * - Uses 2048-bit RSA encryption.
 * - Returns PEM-formatted public and private keys.
 * 
 * @returns {Promise<{publicKey: string, privateKey: string}>} A promise that resolves to an object containing:
 *   - publicKey: The generated RSA public key in PEM format.
 *   - privateKey: The generated RSA private key in PEM format.
 * 
 * @example
 * const { generateKeyPair } = require('./cryptoUtils');
 * 
 * async function createKeys() {
 *   const { publicKey, privateKey } = await generateKeyPair();
 *   console.log(publicKey);
 *   console.log(privateKey);
 * }
 */
const generateKeyPair = () => {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: { type: "spki", format: "pem" },
            privateKeyEncoding: { type: "pkcs8", format: "pem" }
        }, (err, publicKey, privateKey) => {
            if (err) reject(err);
            else resolve({ publicKey, privateKey });
        });
    });
};

module.exports = { generateKeyPair };
