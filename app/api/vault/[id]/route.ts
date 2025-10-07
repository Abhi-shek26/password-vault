import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import VaultItemModel from '../../../lib/models/VaultItem';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import { decryptData } from '../../../lib/crypto';

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, url, notes, encryptedData } = body;

    if (!title || !encryptedData) {
      return NextResponse.json({ error: 'Title and encrypted data are required.' }, { status: 400 });
    }

    await dbConnect();

    const updatedItem = await VaultItemModel.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, url, notes, encryptedData },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating vault item:', error);
    return NextResponse.json({ error: 'Failed to update vault item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { masterPassword } = await req.json();
    if (!masterPassword) {
      return NextResponse.json({ error: 'Master Password is required.' }, { status: 400 });
    }

    await dbConnect();

    const itemToDelete = await VaultItemModel.findOne({ _id: id, userId: session.user.id });
    if (!itemToDelete) {
      return NextResponse.json({ error: 'Item not found or not authorized' }, { status: 404 });
    }

    const decrypted = decryptData(itemToDelete.encryptedData, masterPassword);
    if (!decrypted) {
      return NextResponse.json({ error: 'Incorrect Master Password.' }, { status: 403 });
    }

    await VaultItemModel.deleteOne({ _id: id });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting vault item:', error);
    return NextResponse.json({ error: 'Failed to delete vault item' }, { status: 500 });
  }
}
