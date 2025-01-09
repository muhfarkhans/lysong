"use client";
import React, { useEffect, useState } from "react";
import { secondsToTime, timeToSeconds } from "@/utils/utility";
import {
  RiPlayLargeFill,
  RiResetLeftLine,
  RiStopLargeFill,
} from "react-icons/ri";
import YouTube, { YouTubePlayer } from "react-youtube";

const START_TIME: number = 0;

const YOUTUBE_OPTIONS = {
  height: "100",
  width: "100%",
  playerVars: {
    autoplay: 0,
  },
};

let YOUTUBE_ELEMENT: YouTubePlayer = null;

const SubtitleDisplay = ({ song, theme }: SubtitleDisplayProps) => {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(START_TIME);
  // const [activeSubtitle, setActiveSubtitle] = useState<Array<Lyric | null>>([]);
  const [listSubtitle, setListSubtitle] = useState<
    Array<{
      idLyric: string;
      sec: number;
      secLast: number;
      text: string;
      isLyric: boolean;
      isLast: boolean;
      prev: number;
      next: number;
    }>
  >([]);

  useEffect(() => {
    const duration = timeToSeconds(song.timeEnd);

    const subtitles: Array<{
      idLyric: string;
      sec: number;
      secLast: number;
      text: string;
      isLyric: boolean;
      isLast: boolean;
      prev: number;
      next: number;
    }> = [];

    for (let index = 1; index <= duration; index++) {
      const currIndex = song.lyric.findIndex(
        (sub) =>
          index >= timeToSeconds(sub.start) && index <= timeToSeconds(sub.end)
      );

      let text: string = "...";
      const isLyric: boolean = false;
      const isLast: boolean = false;
      let idLyric: string = "index-" + index;
      let prev: number = 0;
      let next: number = timeToSeconds(song.timeEnd);
      let secLast: number = duration;

      if (currIndex >= 0) {
        secLast = timeToSeconds(song.lyric[currIndex].end);
        text = song.lyric[currIndex].text;
        idLyric = song.lyric[currIndex]._id;

        if (song.lyric[currIndex - 1]) {
          prev = timeToSeconds(song.lyric[currIndex - 1].end) - 1;
        }

        if (song.lyric[currIndex + 1]) {
          next = timeToSeconds(song.lyric[currIndex + 1].start) - 1;
        }
      }

      subtitles.push({
        idLyric: idLyric,
        sec: index,
        secLast: secLast,
        text: text,
        isLyric: isLyric,
        isLast: isLast,
        prev: prev,
        next: next,
      });
    }

    const newSubtitle = subtitles.map((subtitle, index) => {
      let isLyric = subtitle.isLyric;
      let isLast = subtitle.isLast;

      if (index > 0) {
        if (subtitle.idLyric != subtitles[index - 1].idLyric) {
          isLyric = true;
        }
      }

      if (index < subtitles.length - 1) {
        if (subtitle.idLyric != subtitles[index + 1].idLyric) {
          isLast = true;
        }
      }

      if (subtitle.idLyric.includes("index-")) {
        isLast = false;
        isLyric = false;
      }

      return { ...subtitle, isLyric: isLyric, isLast: isLast };
    });

    if (newSubtitle[0].idLyric.includes("index-")) {
      newSubtitle[0].isLyric = true;
    }

    setListSubtitle(newSubtitle);
  }, []);

  useEffect(() => {
    if (playing) {
      YOUTUBE_ELEMENT.target.playVideo();

      const interval = setInterval(() => {
        setCurrentTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      if (YOUTUBE_ELEMENT) {
        YOUTUBE_ELEMENT.target.pauseVideo();
      }
    }
  }, [playing]);

  useEffect(() => {
    // const currIndex = song.lyric.findIndex(
    //   (sub) =>
    //     currentTime >= timeToSeconds(sub.start) &&
    //     currentTime <= timeToSeconds(sub.end)
    // );

    // if (currentTime == START_TIME) {
    //   setActiveSubtitle([
    //     null,
    //     {
    //       text: "...",
    //       _id: "",
    //       start: "",
    //       end: "",
    //     },
    //     song.lyric[0],
    //   ]);
    // }

    // if (currIndex >= 0) {
    //   setActiveSubtitle([
    //     song.lyric[currIndex - 1],
    //     song.lyric[currIndex],
    //     song.lyric[currIndex + 1],
    //   ]);
    // }

    const box = document.getElementById(`box`);
    const elResult = document.getElementById(`lyric-${currentTime}`);

    if (elResult && box) {
      elResult.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, song.lyric]);

  const _onReady = (event: YouTubePlayer) => {
    YOUTUBE_ELEMENT = event;
  };

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col justify-center items-center space-y-2 w-full h-full -mt-10">
        {/* <div className="subtitle space-y-2 text-center">
          {activeSubtitle.map((sub: Lyric | null, index: number) => {
            let text: string = "...";

            if (sub != null) {
              text = sub.text;
            }

            return (
              <p
                key={index}
                className={`${
                  index == 1 ? "font-bold text-xl" : " text-gray-300"
                }`}
              >
                {text}
              </p>
            );
          })}
        </div> */}
        <div className="relative">
          <div
            className={`h-10 w-full absolute top-0 bg-gradient-to-b to-transparent ${
              theme == "dark" ? "from-black" : "from-white"
            }`}
          ></div>
          <div
            className={`h-10 w-full absolute bottom-0 bg-gradient-to-t to-transparent ${
              theme == "dark" ? "from-black" : "from-white"
            }`}
          ></div>
          <div
            id="box"
            className="h-[500px] w-full p-4 rounded overflow-scroll no-scrollbar"
          >
            {listSubtitle.map((subtitle, index) => {
              let active = "";

              if (currentTime < subtitle.secLast && currentTime >= index) {
                active = "font-bold";
              }

              if (subtitle.isLyric) {
                return (
                  <p
                    id={`lyric-${index}`}
                    key={index}
                    className={`text-center ${active} text-3xl my-2`}
                  >
                    {subtitle.isLyric ? subtitle.text : ""}
                  </p>
                );
              }
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 h-14 w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 items-center">
            <div className="flex flex-col">
              <p>{song.title}</p>
              <h3>
                {secondsToTime(currentTime)} / {song.timeEnd}
              </h3>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className={`flex items-center justify-center w-12 h-12 rounded-full text-gray-50 ${
                playing ? "bg-red-400" : "bg-green-400"
              }`}
              onClick={() => {
                setPlaying(!playing);
                document.getElementById(`iframe-yt`);
                const iframe = document.getElementById("iframe-yt");

                if (iframe) {
                  let src = iframe.getAttribute("src") ?? "";

                  if (src.includes("?")) {
                    src += "&autoplay=1";
                  } else {
                    src += "?autoplay=1";
                  }

                  console.log("src: ", src);

                  iframe.setAttribute("src", src);
                }
              }}
            >
              {playing ? <RiStopLargeFill /> : <RiPlayLargeFill />}
            </button>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full bg-red-400 text-gray-50"
              onClick={() => {
                setPlaying(false);
                setCurrentTime(START_TIME);
                if (YOUTUBE_ELEMENT) {
                  YOUTUBE_ELEMENT.target.seekTo(0, true);
                }
              }}
            >
              <RiResetLeftLine />
            </button>
          </div>
        </div>
        <div>
          <YouTube
            videoId={"k2MWBy-Hb1M"}
            opts={YOUTUBE_OPTIONS}
            onReady={_onReady}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SubtitleDisplay;
