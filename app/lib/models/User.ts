import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false, 
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
