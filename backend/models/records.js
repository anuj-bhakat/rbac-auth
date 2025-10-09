import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  productName: { type: String },
  price: { type: Number }
});

const Record = mongoose.model('Record', recordSchema);

export default Record;
