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
    select: false, // By default, do not include the password in query results
  },
});

// This is the crucial part:
// Check if the model is already compiled. If not, compile it.
// This prevents the "OverwriteModelError" in Next.js's hot-reload environment.
export default mongoose.models.User || mongoose.model('User', UserSchema);
