import CryptoJS from 'crypto-js';

export const encryptData = (data: object, secretKey: string): string => {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
};

export const decryptData = (encryptedData: string, secretKey: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedJson) {
      return null;
    }
    return JSON.parse(decryptedJson);
  } catch (e) {
    console.error("Decryption failed:", e);
    return null; 
  }
};
