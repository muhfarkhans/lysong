import { NextResponse } from "next/server";
import { connectToMongoDB } from "@/lib/mongodb";
import Joi from "joi";
import SongReq from "@/models/songReq";

export async function GET(request: Request) {
  try {
    await connectToMongoDB();

    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword");

    let query = {};
    if (keyword) {
      query = {
        $or: [{ name: { $regex: keyword, $options: "i" } }],
      };
    }

    const songReq = await SongReq.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ message: true, data: songReq }, { status: 200 });
  } catch (error) {
    console.error("Error fetching song requests:", error);
    return NextResponse.json({ message: false, data: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const songReqSchema = Joi.object({
    name: Joi.string().required(),
    note: Joi.string().required(),
  });

  try {
    const data = await request.json();

    const { error } = songReqSchema.validate(data, { abortEarly: false });

    if (error) {
      return NextResponse.json(
        { message: false, data: error.details },
        { status: 422 }
      );
    } else {
      await connectToMongoDB();
      const songReq = new SongReq({
        name: data.name,
        note: data.note,
      });
      await songReq.save();
      console.log(`Your request submitted successfully!`);
    }

    return NextResponse.json({ message: true, data: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating request:", error);
    return NextResponse.json({ message: false, data: null }, { status: 500 });
  }
}
