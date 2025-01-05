import mongoose, { Schema, Document } from "mongoose";
import Lyric from "./lyric";

interface Song extends Document {
  id: string;
  title: string;
  timeEnd: string;
  lyric: Lyric[];
}

const songSchema = new Schema<Song>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  timeEnd: { type: String, required: true },
  lyric: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Lyric", required: true },
  ],
});

const Song = mongoose.models.Song || mongoose.model<Song>("Song", songSchema);

export default Song;
