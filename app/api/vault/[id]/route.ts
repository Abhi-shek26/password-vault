import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import VaultItemModel from '../../../lib/models/VaultItem';
import { getServerSession } from "next-auth/next"; // <-- Import
import { authOptions } from "../../../lib/auth";

type RouteParams = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { title, url, notes, encryptedData } = await req.json();
    const updatedItem = await VaultItemModel.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { title, url, notes, encryptedData },
      { new: true }
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found or user not authorized' }, { status: 404 });
    }
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating vault item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();
  try {
    const deletedItem = await VaultItemModel.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!deletedItem) {
      return NextResponse.json({ error: 'Item not found or user not authorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting vault item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
