import mongoose, { Schema, Document } from 'mongoose';

interface Service extends Document {
  name: string;
  image: string;
  price: number;
  description: string;
  revision: number;
  workingTime: number;
  availability: string;
}

const ServiceSchema: Schema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: false },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  revision: { type: Number, required: true },
  workingTime: { type: Number, required: true },
  availability: { type: String, required: true, enum: ['available', 'not available'] },
});

export default mongoose.models.Service || mongoose.model<Service>('Service', ServiceSchema);
