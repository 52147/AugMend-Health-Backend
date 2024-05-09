// Load environment variables
require('dotenv').config();
const crypto = require('crypto');

// Retrieve the encryption key from .env
const encryptionKey = process.env.ENCRYPTION_KEY;

// Encrypt function
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};

// Decrypt function
const decrypt = (encryptedText) => {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encrypted = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Example usage (for testing purposes)
const originalText = 'Sensitive data';
const encryptedText = encrypt(originalText);
const decryptedText = decrypt(encryptedText);

console.log('Original:', originalText);
console.log('Encrypted:', encryptedText);
console.log('Decrypted:', decryptedText);

// Export functions for external use
module.exports = { encrypt, decrypt };
