import { connectToMongoDB } from "@/lib/mongodb";
import Song from "@/models/song";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id: string = params.id;

  try {
    await connectToMongoDB();

    const songs = await Song.findById(id).populate("lyric");

    return Response.json({ message: true, data: songs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching song:", error);
    return Response.json({ message: false, data: null }, { status: 500 });
  }
}
