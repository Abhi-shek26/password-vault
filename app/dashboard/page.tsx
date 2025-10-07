'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import PasswordGenerator from '../components/vault/Generator';
import VaultList from '../components/vault/VaultList';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ExportVault from '../components/vault/ExportVault';
import ImportVault from '../components/vault/ImportVault';
import { encryptData, decryptData } from '../lib/crypto';
import { IVaultItem } from '../lib/models/VaultItem';

interface DecryptedData {
  username: string;
  password: string;
}

interface FormState {
  title: string;
  url: string;
  username: string;
  password: string;
  notes: string;
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();

  // State Management
  const [vaultItems, setVaultItems] = useState<IVaultItem[]>([]);
  const [masterPassword, setMasterPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IVaultItem | null>(null);
  const [formState, setFormState] = useState<FormState>({
    title: '', url: '', username: '', password: '', notes: ''
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // Fetch vault items on load
  const fetchVaultItems = useCallback(async () => {
    if (status !== 'authenticated') return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/vault');
      if (!res.ok) throw new Error('Failed to fetch vault items.');
      const data = await res.json();
      setVaultItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVaultItems();
    }
  }, [status, fetchVaultItems]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setFormState({ title: '', url: '', username: '', password: '', notes: '' });
    setIsFormVisible(true);
  };
  
  const handleEdit = (item: IVaultItem) => {
    if (!masterPassword) {
      setError('Please enter your master password to decrypt and edit items.');
      return;
    }
    const decrypted = decryptData(item.encryptedData, masterPassword) as DecryptedData | null;
    if (!decrypted) {
      setError('Decryption failed. Incorrect master password.');
      return;
    }
    setSelectedItem(item);
    setFormState({
        title: item.title,
        url: item.url || '',
        notes: item.notes || '',
        username: (decrypted as DecryptedData).username || '',
        password: (decrypted as DecryptedData).password || '',
    });
    setIsFormVisible(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
     const enteredMasterPassword = prompt('To confirm deletion, please re-enter your Master Password:');
if (!enteredMasterPassword) {
    return; // User cancelled the prompt.
  }
  
  // This client-side check provides immediate feedback.
  if (enteredMasterPassword !== masterPassword) {
      setError("The password you entered doesn't match the one used to unlock the vault.");
      return;
  }

  // Proceed with backend deletion
  try {
    const res = await fetch(`/api/vault/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterPassword: enteredMasterPassword }),
    });

    if (res.ok) {
      setVaultItems(prev => prev.filter(v => (v._id as string) !== id));
      setError('');
    } else {
      const data = await res.json();
      setError(data.error || data.message || 'Failed to delete item.');
    }
  } catch (err) {
    console.error(err);
    setError('A network error occurred while deleting the item.');
  }
};


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword) {
      setError('Master password is required to save an item.');
      return;
    }

    const encryptedData = encryptData({ username: formState.username, password: formState.password }, masterPassword);
    
    const url = selectedItem ? `/api/vault/${selectedItem._id}` : '/api/vault';
    const method = selectedItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formState, encryptedData }),
    });

    if (res.ok) {
      fetchVaultItems();
      setIsFormVisible(false);
    } else {
      const data = await res.json();
      setError(data.message || 'Failed to save item.');
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="text-center p-10">Loading your vault...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <section>
            <PasswordGenerator />
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Master Password</h2>
            <p className="text-sm text-gray-400 mb-2">Enter this to encrypt/decrypt items. It is never stored.</p>
            <Input
              type="password"
              placeholder="Enter your Master Password"
              value={masterPassword}
              onChange={(e) => setMasterPassword(e.target.value)}
            />
          </section>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Vault</h2>
            <Button onClick={handleAddNew}>Add New Item</Button>
          </div>
          <Input
            type="search"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <VaultList items={vaultItems} onEdit={handleEdit} onDelete={handleDelete} searchQuery={searchQuery} />
        </div>
        <div className="space-y-6">
              <ExportVault vaultItems={vaultItems} />
              <ImportVault 
                currentMasterPassword={masterPassword} 
                onImportSuccess={fetchVaultItems} 
              />
            </div>
      </div>

      {isFormVisible && (
  <div className="fixed inset-0 bg-background/50 flex items-center justify-center p-4 z-50 backdrop-blur-lg">
    <form 
      onSubmit={handleSave} 
      className="bg-card text-foreground p-6 rounded-lg shadow-xl w-full max-w-md space-y-4 border border-muted"
    >
      <h3 className="text-xl font-bold">{selectedItem ? 'Edit Item' : 'Add New Item'}</h3>      
      <Input name="title" placeholder="Title" value={formState.title} onChange={handleFormChange} required />
      <Input name="url" placeholder="URL (optional)" value={formState.url} onChange={handleFormChange} />
      <Input name="username" placeholder="Username/Email" value={formState.username} onChange={handleFormChange} />
      <Input name="password" placeholder="Password" value={formState.password} onChange={handleFormChange} required />
      
      <textarea 
        name="notes" 
        placeholder="Notes (optional)" 
        value={formState.notes} 
        onChange={handleFormChange} 
        className="w-full px-3 py-2 rounded-md border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="danger" onClick={() => setIsFormVisible(false)}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  </div>
)}

    </div>
  );
}
