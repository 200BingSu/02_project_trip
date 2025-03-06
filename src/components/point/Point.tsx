import { AiOutlineScan } from "react-icons/ai";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";
interface PointProps {
  handleClose?: () => void;
}
const Point = ({ handleClose }: PointProps): JSX.Element => {
  return (
    <div className="max-w-[768px] w-full h-screen fixed top-0 left-1/2 -translate-x-1/2 bg-white z-50">
      <TitleHeaderTs icon="" onClick={handleClose} />
      <div className="h-screen pb-16 flex flex-col justify-center items-center">
        <div className="relative inline-block p-4 w-36">
          <img
            src="https://cdn-icons-png.flaticon.com/512/241/241528.png"
            alt=""
          />
          <div className="absolute top-0 left-0 w-10 h-10 rounded-tl-xl border-t-4 border-l-4 border-primary"></div>
          <div className="absolute top-0 right-0 w-10 h-10 rounded-tr-xl border-t-4 border-r-4 border-primary"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 rounded-bl-xl border-b-4 border-l-4 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 rounded-br-xl   border-b-4 border-r-4 border-primary"></div>
        </div>

        <p className="flex items-center text-slate-700 text-base mt-6">
          <AiOutlineScan className="text-2xl text-slate-400 mr-1" />
          <b>QR코드</b>를 촬영해주세요
        </p>
      </div>
    </div>
  );
};

export default Point;
