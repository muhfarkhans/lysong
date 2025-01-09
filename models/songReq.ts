import mongoose, { Schema } from "mongoose";
import Document from "next/document";
import Song from "./song";

interface SongReq extends Document {
  name: string;
  note: string;
  song: Song;
  createdAt: Date;
  updatedAt: Date;
}

const songReqSchema = new Schema<SongReq>(
  {
    name: { type: String, required: false },
    note: { type: String, required: true },
    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const SongReq =
  mongoose.models.SongReq || mongoose.model<SongReq>("SongReq", songReqSchema);

export default SongReq;
