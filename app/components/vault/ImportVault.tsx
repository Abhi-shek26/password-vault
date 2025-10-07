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
  const [importMasterPassword, setImportMasterPassword] = useState('');
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) return setError('Please select a file to import.');
    if (!importMasterPassword) return setError('Please enter the Master Password.');

    setIsImporting(true);
    setError('');

    try {
      const text = await file.text();
      const importedItems = JSON.parse(text);

      if (!Array.isArray(importedItems) || importedItems.length === 0)
        throw new Error('Invalid or empty import file.');

      const test = decryptData(importedItems[0].encryptedData, importMasterPassword);
      if (!test) throw new Error('Incorrect Master Password or corrupted file.');

      for (const item of importedItems) {
        const decrypted = decryptData(item.encryptedData, importMasterPassword);
        if (!decrypted) throw new Error('Failed to decrypt one or more items.');
        const reEncrypted = encryptData(decrypted, currentMasterPassword);

        await fetch('/api/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            url: item.url,
            notes: item.notes,
            encryptedData: reEncrypted,
          }),
        });
      }

      alert('Vault imported successfully!');
      onImportSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to import vault.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-md flex flex-col justify-between min-h-[260px]">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Import Vault</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Import items from an encrypted backup file.
        </p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4">
          <Input type="file" accept=".json" onChange={handleFileChange} />
          <Input
            type="password"
            placeholder="Master Password of export file"
            value={importMasterPassword}
            onChange={(e) => setImportMasterPassword(e.target.value)}
            disabled={isImporting}
          />
        </div>
      </div>

      <Button
        onClick={handleImport}
        disabled={isImporting}
        className="w-full mt-5 font-medium transition-all hover:opacity-90"
      >
        {isImporting ? 'Importing...' : 'Import Vault'}
      </Button>
    </div>
  );
}
