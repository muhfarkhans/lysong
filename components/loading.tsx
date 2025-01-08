import { SyncLoader } from "react-spinners";

interface ILoadingProps {
  theme: string;
}

const Loading = ({ theme }: ILoadingProps) => {
  return <SyncLoader color={`${theme == "dark" ? "#f9fafb" : "#030712"}`} />;
};

export default Loading;
