import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/db';
import VaultItemModel from '../../lib/models/VaultItem';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../lib/auth";


export async function GET() {
  const session = await getServerSession(authOptions);  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();
  try {
    const items = await VaultItemModel.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching vault items:', error);
    return NextResponse.json({ error: 'Failed to fetch vault items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();
  try {
    const { title, url, notes, encryptedData } = await req.json();

    if (!title || !encryptedData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newItem = new VaultItemModel({
      userId: session.user.id,
      title,
      url,
      notes,
      encryptedData,
    });

    await newItem.save();
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error creating vault item:', error);
    return NextResponse.json({ error: 'Failed to create vault item' }, { status: 500 });
  }
}
