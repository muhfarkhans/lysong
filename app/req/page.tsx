"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Loading from "@/components/loading";
import ThemeToggle from "@/components/themetoggle";
import axios from "axios";
import Link from "next/link";
import { format } from "date-fns";
import { RiListCheck3 } from "react-icons/ri";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "-";
  }

  return format(date, "PPpp");
};

const SongRequestPage = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<{ name: string; note: string }>({
    name: "",
    note: "",
  });
  const [list, setList] = useState<SongReq[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const findSongRequest = async (keyword: string) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/songreq", {
        params: { keyword: keyword },
      });

      setList(res.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching song request:", error);
      setLoading(false);
    }
  };

  const submitForm = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setLoading(true);
    try {
      await axios.post("/api/songreq", { ...formData });

      findSongRequest("");
      setFormData({
        name: "",
        note: "",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error submit request:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    findSongRequest("");
  }, []);

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
      <div className="my-10">
        <form action="">
          <div className="mb-8">
            <label htmlFor="">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="..."
              className="w-full text-2xl pl-2 py-2 border rounded"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </div>
          <div className="mb-8">
            <label htmlFor="">
              Note <span className="text-red-500">*</span>
            </label>
            <textarea
              name=""
              id=""
              placeholder="..."
              className="w-full text-2xl pl-2 py-2 border rounded"
              onChange={(event) =>
                setFormData({ ...formData, note: event.target.value })
              }
              value={formData.note}
            ></textarea>
          </div>
          <button
            className="px-6 py-2 rounded bg-blue-400 text-gray-50"
            onClick={(event) => submitForm(event)}
          >
            Submit
          </button>
        </form>
      </div>

      <div className="mt-20 space-y-6 h-full">
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
                    <p className="font-bold">{song.name}</p>
                    <p>{song.note}</p>
                    <p className=" text-sm text-gray-500">
                      {formatDate(song.createdAt)}
                    </p>
                  </div>
                );
              })}

            {list?.length == 0 ? <p>Not found</p> : ""}
          </>
        )}
      </div>
    </div>
  );
};

export default SongRequestPage;
