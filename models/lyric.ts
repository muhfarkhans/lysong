import mongoose, { Schema, Document } from "mongoose";

interface Lyric extends Document {
  text: string;
  start: string;
  end: string;
}

const lyricSchema = new Schema<Lyric>({
  text: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const Lyric =
  mongoose.models.Lyric || mongoose.model<Lyric>("Lyric", lyricSchema);

export default Lyric;
