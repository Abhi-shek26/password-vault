import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  url: string;
  notes: string;
  encryptedData: string; // Will store encrypted username/password
}

const VaultItemSchema: Schema<IVaultItem> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  notes: {
    type: String,
  },
  encryptedData: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const VaultItemModel: Model<IVaultItem> = models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);

export default VaultItemModel;

