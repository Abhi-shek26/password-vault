'use client';
import React from 'react';
import Button from '../ui/Button';
import { IVaultItem } from '../../lib/models/VaultItem';

interface ExportVaultProps {
  vaultItems: IVaultItem[];
}

export default function ExportVault({ vaultItems }: ExportVaultProps) {
  const handleExport = () => {
    if (vaultItems.length === 0) {
      alert('Your vault is empty. Nothing to export.');
      return;
    }

    const exportData = vaultItems.map(item => ({
      title: item.title,
      url: item.url,
      notes: item.notes,
      encryptedData: item.encryptedData,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    link.download = `vault-export-${timestamp}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-md flex flex-col justify-between min-h-[260px]">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Export Vault</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Download a secure, encrypted backup of your vault. You’ll need your Master Password to import it later.
        </p>
      </div>

      <Button
        onClick={handleExport}
        variant="primary"
        className="w-full mt-5 font-medium transition-all hover:opacity-90"
      >
        Download Encrypted Export
      </Button>
    </div>
  );
}
