import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  profileImage: string;
}

const UserSchema = new mongoose.Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' }, // Can be set manually or via Gravatar
});

export default (mongoose.models.User as mongoose.Model<User>) || mongoose.model('User', UserSchema);
