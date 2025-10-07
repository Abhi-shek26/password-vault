import React from 'react';
import Button from '../../components/ui/Button';
import { IVaultItem } from '../../lib/models/VaultItem'; // Import the type definition

interface VaultItemProps {
  item: IVaultItem;
  onEdit: (item: IVaultItem) => void;
  onDelete: (id: string) => void;
}

const VaultItem: React.FC<VaultItemProps> = ({ item, onEdit, onDelete }) => {
  // A small helper to make the URL more readable if it's very long
  const displayUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch (e) {
      // If it's not a valid URL, just show the first part of it
      return url.length > 30 ? `${url.substring(0, 27)}...` : url;
    }
  };

  return (
    <div className="p-4 bg-card rounded-lg flex items-center justify-between gap-4 transition-colors hover:bg-gray-700">
      {/* Item Details Section */}
      <div className="flex-grow overflow-hidden">
        <h3 className="font-bold text-lg text-foreground truncate">{item.title}</h3>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline break-all"
            onClick={(e) => e.stopPropagation()} // Prevents triggering parent onClick events
          >
            {displayUrl(item.url)}
          </a>
        )}
      </div>

      {/* Action Buttons Section */}
      <div className="flex-shrink-0 flex gap-2">
        <Button onClick={() => onEdit(item)}>
          Edit
        </Button>
        <Button onClick={() => onDelete(String(item._id))} variant="danger">
          Delete
        </Button>
      </div>
    </div>
  );
};

export default VaultItem;
