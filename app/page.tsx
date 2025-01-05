"use client";

import ThemeToggle from "@/components/themetoggle";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState<Song[]>();

  const findLyric = async (keyword: string) => {
    try {
      const res = await axios.get("/api/songs", {
        params: { keyword: keyword },
      });

      setList(res.data.data || []);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
    }
  };

  return (
    <div className="container mx-auto px-8 md:px-20 h-screen">
      <div className="my-8 container mx-auto flex justify-between">
        <Link href={"/"}>
          <span className="font-bold">Lysong</span>
        </Link>

        <div>
          <ThemeToggle />
        </div>
      </div>
      <div className="py-20">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Type Title..."
            className="w-full text-2xl pl-2 py-2 border rounded"
            onChange={(event) => setKeyword(event.target.value)}
          />
          <button
            className="px-6 py-2 rounded bg-blue-400 text-gray-50"
            onClick={() => findLyric(keyword)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {list &&
          list.map((song, index) => {
            return (
              <div
                className="border rounded p-4 shadow hover:shadow-lg"
                key={index}
              >
                <Link href={`/lyric/${song._id}`}>
                  <p className="font-bold">{song.title}</p>
                  <p>{song.timeEnd.substring(0, 5)}</p>
                </Link>
              </div>
            );
          })}

        {list?.length == 0 ? <p>Not found</p> : ""}
      </div>
    </div>
  );
}
