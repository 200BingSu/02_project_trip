import { LiaComment } from "react-icons/lia";

interface NoDataProps {
  content: string;
}

const NoData = ({ content = "결과가 없습니다" }: NoDataProps) => {
  return (
    <div className="flex flex-col items-center p-20">
      <LiaComment className="w-full text-slate-300 text-8xl mb-5 " />
      <p className="text-2xl text-slate-400 ">{content}</p>
    </div>
  );
};

export default NoData;
