import CryptoJS from 'crypto-js';

// IMPORTANT: The secret key should be derived from the user's master password
// and should NEVER be hardcoded like this. This is a simplified example.
// In a real app, you would ask the user for their master password on login
// and use it to derive this key.

export const encryptData = (data: object, secretKey: string): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
};

export const decryptData = (encryptedData: string, secretKey: string): object | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedJson);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null; // Indicates a wrong key or corrupted data
  }
};
