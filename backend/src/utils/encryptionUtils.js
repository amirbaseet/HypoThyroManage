const NodeRSA = require("node-rsa");
const crypto = require("crypto");

//Genarate RSA Key Pair 
exports.generateRSAKeys = () =>{

    const key = NodeRSA({ b: 2048 });
    return{
        publicKey: key.exportKey("public"),
        privateKey: key.exportKey("private")
    };
};

// Generate AES Key
exports.generateAESKey = ()=> {
    return crypto.randomBytes(32).toString("hex");
}
// Encrypt Message using AES
exports.encryptMessageAES = (message, aesKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(aesKey, "hex"), iv);
    let encrypted = cipher.update(message, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}

// Decrypt Message using AES
exports.decryptMessageAES = (encryptedMessage, aesKey) => {
    const [iv, encrypted] = encryptedMessage.split(":");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(aesKey, "hex"), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

//  Encrypt AES Key using RSA (Ensure OAEP Padding)
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

//  Decrypt AES Key using RSA (Ensure OAEP Padding)
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
