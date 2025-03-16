import { LiaComment } from "react-icons/lia";

interface NoDataProps {
  icon?: React.ReactNode;
  content: string;
}

const NoData = ({
  content = "결과가 없습니다",
  icon = <LiaComment />,
}: NoDataProps) => {
  return (
    <div className="flex flex-col items-center p-20">
      <p className="text-slate-300 text-8xl mb-5 flex items-center">{icon}</p>
      <p className="text-2xl text-slate-400 ">{content}</p>
    </div>
  );
};

export default NoData;
