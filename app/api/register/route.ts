import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../lib/db';
import UserModel from '../../lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
    await dbConnect();
    const { email, password } = await req.json();
    if (!email || !password || password.length < 8) {
      return NextResponse.json({ message: 'Email and a password of at least 8 characters are required' }, { status: 400 });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      email,
      password: hashedPassword,
    });
    console.log('Successfully created user:', user._id); // Good for debugging

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch  {
    console.error('REGISTRATION ERROR:');
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
