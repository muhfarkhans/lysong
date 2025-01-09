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
  lyric: Lyric[];
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
