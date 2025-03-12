import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BiTime } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { RxStarFilled } from "react-icons/rx";
import { ProductPic } from "../../constants/pic";
import { categoryKor } from "../../utils/match";
import { IStrf } from "../../types/interface";

export interface StrInfoProps {
  strfId: string | number;
  contentData: IStrf; // ContentData 대신 IStrf 사용
}

const StrInfo = ({ strfId, contentData }: StrInfoProps): JSX.Element => {
  return (
    <div>
      <div>
        <img
          src={`${ProductPic}/${strfId}/${contentData?.strfPics[0].strfPic}`}
          alt={contentData?.strfTitle || ""}
        />
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <p className="text-sm text-slate-500 -mb-[6px]">
          {categoryKor(contentData?.category)}
        </p>
        <h2 className="text-2xl text-slate-700 font-semibold">
          {contentData?.strfTitle}
        </h2>
        <p className="text-sm text-slate-500 flex items-center gap-[6px]">
          <FaLocationDot className=" text-slate-300" />
          {contentData?.address}
        </p>
        <ul className="flex items-center gap-[6px]">
          <li>
            <RxStarFilled className="text-primary text-base" />
          </li>
          <li className="text-sm text-slate-700 font-semibold">
            {contentData?.ratingAvg}
          </li>
          <li className="text-sm text-primary underline">
            리뷰 {contentData?.reviewCnt.toLocaleString()}개
          </li>
          <li className="text-slate-300 text-base mx-1">|</li>
          <li className="text-lg text-slate-400">
            {contentData?.wishIn ? (
              <AiFillHeart className="text-secondary3" />
            ) : (
              <AiOutlineHeart />
            )}
          </li>
          <li className="text-slate-500 text-sm">{contentData?.wishCnt}</li>
        </ul>
        <div>
          <p className="flex items-center gap-[6px] text-slate-500">
            <BiTime className="text-base" />
            매일 00:00 ~ 24:00
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrInfo;
