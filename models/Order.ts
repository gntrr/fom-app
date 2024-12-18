import mongoose, { Schema, Document } from 'mongoose';

interface Order extends Document {
  transactionNumber: string;
  name: string;
  whatsappNumber: string;
  services: mongoose.Schema.Types.ObjectId; // Reference to Service model
  brief: string;
  uploadedFile?: string;
  deadline: Date;
  price: number;
  status: string;
}

const OrderSchema = new mongoose.Schema<Order>({
  transactionNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  services: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true }, // Reference to Service model
  brief: { type: String, required: true },
  uploadedFile: { type: String },
  deadline: { type: Date, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
});

export default (mongoose.models.Order as mongoose.Model<Order>) || mongoose.model('Order', OrderSchema);
