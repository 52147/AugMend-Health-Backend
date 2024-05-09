const crypto = require("crypto");
require("dotenv").config();

const decryptFeedback = (encryptedFeedback) => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptionIv = process.env.ENCRYPTION_IV;

  if (!encryptionKey || !encryptionIv) {
    throw new Error("Encryption key or IV is missing. Check your .env file.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    Buffer.from(encryptionIv, "hex")
  );

  let decrypted = decipher.update(encryptedFeedback, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

module.exports = { decryptFeedback };
