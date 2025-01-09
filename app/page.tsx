"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import axios from "axios";
import Loading from "@/components/loading";
import ThemeToggle from "@/components/themetoggle";
import { RiListCheck3 } from "react-icons/ri";

export default function Home() {
  const { theme } = useTheme();
  const [keyword, setKeyword] = useState("");
  const [list, setList] = useState<Song[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const findLyric = async (keyword: string) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/songs", {
        params: { keyword: keyword },
      });

      setList(res.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-8 md:px-20 h-screen">
      <div className="my-8 container mx-auto flex justify-between">
        <Link href={"/"}>
          <span className="font-bold">Lysong</span>
        </Link>

        <div className="flex gap-4 items-center">
          <Link href={"/req"}>
            <RiListCheck3 />
          </Link>
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
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                findLyric(keyword);
              }
            }}
          />
          <button
            className="px-6 py-2 rounded bg-blue-400 text-gray-50"
            onClick={() => findLyric(keyword)}
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-6 h-full">
        {loading ? (
          <div className="place-self-center">
            <Loading theme={theme ?? "light"} />
          </div>
        ) : (
          <>
            {list &&
              list.map((song, index) => {
                return (
                  <div
                    className={`border rounded p-4 ${
                      theme == "dark"
                        ? "shadow-white hover:text-gray-800 hover:bg-gray-50"
                        : "shadow-black"
                    } hover:shadow-lg`}
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
          </>
        )}
      </div>
    </div>
  );
}
