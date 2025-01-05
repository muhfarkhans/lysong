"use client";
import SubtitleDisplay from "@/components/subtitle";
import axios from "axios";
import { useState, useEffect } from "react";

const LyricDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [id, setId] = useState<string | null>(null);
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchSong = async () => {
      if (id) {
        try {
          const foundSong = await findLyric(id);
          setSong(foundSong);
        } catch (error) {
          console.error("Error fetching song:", error);
        }
      }
    };

    fetchSong();
  }, [id]);

  const findLyric = async (id: string) => {
    const res = await axios.get(`/api/songs/${id}`);
    return res.data.data || null;
  };

  if (!song) {
    return (
      <div className="container mx-auto px-8 md:px-20 h-screen">
        <div className="flex justify-center items-center h-full">
          <p>Loading or song not found...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-8 md:px-20 h-screen">
        <div className="flex justify-center items-center h-full">
          <SubtitleDisplay song={song} />
        </div>
      </div>
    </>
  );
};

export default LyricDetail;
