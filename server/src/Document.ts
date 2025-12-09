import { Schema, model } from "mongoose";

// We do NOT extend 'MongoDocument' here.
// This prevents the conflict between string IDs and ObjectId.
interface IDocument {
  _id: string;
  data: Object;
}

const DocumentSchema = new Schema<IDocument>({
  _id: { type: String, required: true },
  data: { type: Object, required: true },
});

export default model<IDocument>("Document", DocumentSchema);