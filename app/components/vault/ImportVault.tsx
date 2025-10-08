'use client';
import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { encryptData, decryptData } from '../../lib/crypto';

interface ImportVaultProps {
  currentMasterPassword: string;
  onImportSuccess: () => void;
}

export default function ImportVault({ currentMasterPassword, onImportSuccess }: ImportVaultProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importMasterPassword, setImportMasterPassword] = useState(''); // Optional, only for encrypted files
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) return setError('Please select a file to import.');
    if (!currentMasterPassword) return setError('Current vault is not unlocked. Please unlock it first.');

    setIsImporting(true);
    setError('');

    try {
      const text = await file.text();
      const items: any[] = JSON.parse(text);
      if (!Array.isArray(items) || items.length === 0) throw new Error('Invalid or empty import file.');

      const firstItem = items[0];
      const isEncryptedImport = 'encryptedData' in firstItem;

      if (isEncryptedImport && !importMasterPassword) {
        throw new Error('This appears to be an encrypted file. Please provide the export Master Password.');
      }

      for (const item of items) {
        let dataToEncrypt: { username: string, password: string };

        if (isEncryptedImport) {
          // Encrypted file flow: decrypt with import pass, then re-encrypt with current pass
          const decrypted = decryptData(item.encryptedData, importMasterPassword);
          if (!decrypted) {
            throw new Error('Incorrect import Master Password or corrupted file.');
          }
          dataToEncrypt = decrypted;
        } else {
          // Plaintext file flow: just use the data directly
          if (!item.username || !item.password) continue; // Skip items without credentials
          dataToEncrypt = { username: item.username, password: item.password };
        }

        const reEncryptedData = encryptData(dataToEncrypt, currentMasterPassword);
        
        await fetch('/api/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            url: item.url,
            notes: item.notes,
            encryptedData: reEncryptedData,
          }),
        });
      }

      alert('Vault imported successfully!');
      onImportSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed to import vault.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-lg mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-2">Import Vault</h3>
      <p className="text-sm text-muted-foreground mb-4">Import items from an encrypted or plaintext backup file.</p>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="space-y-4">
        <Input type="file" accept=".json" onChange={handleFileChange} />
        <Input
          type="password"
          placeholder="Password for encrypted file (if any)"
          value={importMasterPassword}
          onChange={(e) => setImportMasterPassword(e.target.value)}
          disabled={isImporting}
        />
        <Button onClick={handleImport} disabled={isImporting} className="w-full">
          {isImporting ? 'Importing...' : 'Import Vault'}
        </Button>
      </div>
    </div>
  );
}
