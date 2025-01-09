import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import Lyric from "@/models/lyric";
import Song from "@/models/song";
import Joi from "joi";

export async function GET(request: Request) {
  try {
    await connectToMongoDB();

    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword");

    let query = {};
    if (keyword) {
      query = {
        $or: [{ title: { $regex: keyword, $options: "i" } }],
      };
    }

    const songs = await Song.find(query).populate("lyric");

    return NextResponse.json({ message: true, data: songs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json({ message: false, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const lyricSchema = Joi.object({
    text: Joi.string().required(),
    start: Joi.string()
      .pattern(/^(?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "time format")
      .required(),
    end: Joi.string()
      .pattern(/^(?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "time format")
      .required(),
  });

  const songSchema = Joi.array().items(
    Joi.object({
      id: Joi.string().guid({ version: "uuidv4" }).required(),
      title: Joi.string().required(),
      timeEnd: Joi.string()
        .pattern(/^(?:[01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, "time format")
        .required(),
      ytId: Joi.string().required(),
      lyric: Joi.array().items(lyricSchema).required(),
    })
  );

  const token = request.headers.get("token");
  if (token !== process.env.TOKEN) {
    return NextResponse.json(
      { message: false, data: "Not authorized" },
      { status: 403 }
    );
  }

  try {
    const data = await request.json();

    const { error } = songSchema.validate(data, { abortEarly: false });

    if (error) {
      return NextResponse.json(
        { message: false, data: error.details },
        { status: 422 }
      );
    } else {
      await connectToMongoDB();
      for (const songData of data) {
        const savedLyrics = await Promise.all(
          songData.lyric.map(async (lyricData: Lyric) => {
            const lyric = new Lyric(lyricData);
            await lyric.save();
            return lyric._id;
          })
        );
        const song = new Song({
          id: songData.id,
          title: songData.title,
          timeEnd: songData.timeEnd,
          ytId: songData.ytId,
          lyric: savedLyrics,
        });
        await song.save();
        console.log(`Song '${song.title}' saved successfully!`);
      }
    }

    return NextResponse.json({ message: true, data: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json({ message: false, data: null }, { status: 500 });
  }
}
