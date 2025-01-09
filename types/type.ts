type Lyric = {
  _id: string;
  text: string;
  start: string;
  end: string;
};

type Song = {
  _id: string;
  title: string;
  timeEnd: string;
  ytId: string;
  lyric: Lyric[];
};

type SongReq = {
  _id: string;
  name: string;
  note: string;
  songId: string;
  createdAt: string;
  updatedAt: string;
};

interface ISubtitleProps {
  text: string;
  start: string;
  end: string;
}

interface SubtitleDisplayProps {
  theme: string;
  song: Song;
}
