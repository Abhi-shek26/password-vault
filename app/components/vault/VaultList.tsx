import React from 'react';
// import VaultItem from './VaultItem'; // Removed due to local declaration conflict
import { IVaultItem } from '../../lib/models/VaultItem'; // Assuming you have this interface
import Button from '../ui/Button';

interface VaultListProps {
  items: IVaultItem[];
  onEdit: (item: IVaultItem) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
}

const VaultList: React.FC<VaultListProps> = ({ items, onEdit, onDelete, searchQuery }) => {
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (items.length === 0) {
    return <p className="text-center text-gray-400 mt-8">Your vault is empty. Add a new item to get started!</p>;
  }

  if (filteredItems.length === 0) {
    return <p className="text-center text-gray-400 mt-8">No items match your search.</p>;
  }

  return (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <VaultItem key={String(item._id)} item={item} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default VaultList;

// --- Sub-component for displaying a single item ---

interface VaultItemProps {
  item: IVaultItem;
  onEdit: (item: IVaultItem) => void;
  onDelete: (id: string) => void;
}

const VaultItem: React.FC<VaultItemProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-400">{item.url}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => onEdit(item)}>Edit</Button>
        <Button onClick={() => onDelete((item._id as string).toString())} variant="danger">Delete</Button>
      </div>
    </div>
  );
};
