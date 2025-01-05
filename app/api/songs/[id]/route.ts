import { connectToMongoDB } from "@/lib/mongodb";
import Song from "@/models/song";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const segments = request.nextUrl.pathname.split("/");

  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json({ message: false, data: null }, { status: 400 });
  }

  try {
    await connectToMongoDB();

    const song = await Song.findById(id).populate("lyric");

    if (!song) {
      return NextResponse.json(
        { message: false, data: "not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: true, data: song }, { status: 200 });
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json({ message: false, data: null }, { status: 500 });
  }
}
