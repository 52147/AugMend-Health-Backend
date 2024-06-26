const crypto = require("crypto");
require("dotenv").config();

// Encrypt Feedback
const encryptFeedback = (feedback) => {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  const encryptionIv = process.env.ENCRYPTION_IV;

  if (!encryptionKey || !encryptionIv) {
    throw new Error("Encryption key or IV is missing. Check your .env file.");
  }

  if (typeof feedback !== "string") {
    throw new TypeError("The feedback must be a string.");
  }

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(encryptionKey, "hex"),
    Buffer.from(encryptionIv, "hex")
  );
  let encrypted = cipher.update(feedback, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

module.exports = { encryptFeedback };
