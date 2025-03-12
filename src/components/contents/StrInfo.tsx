import { useEffect, useState } from "react";
import { BiTime } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { IStrf } from "../../types/interface";
import jwtAxios from "../../apis/jwt";
import { ProductPic } from "../../constants/pic";
import { RxStarFilled } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";

const StrInfo = ({ strfId }: { strfId: number }) => {
  const [contentData, setContentData] = useState<IStrf>();

  const getDetailMember = async () => {
    try {
      const res = await jwtAxios.get(`/api/detail/member?&strf_id=${strfId}`);
      res.data.data;
      console.log("상품조회-회원", res.data.data);
      setContentData(res.data.data);
    } catch (error) {
      console.log("상품조회-회원", error);
    }
  };

  useEffect(() => {
    getDetailMember();
  }, []);

  return (
    <div>
      <div>
        <img
          src={`${ProductPic}/${strfId}/${contentData?.strfPics[0].strfPic}`}
          alt={contentData?.strfTitle || ""}
        />
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <p className="text-sm text-slate-500 -mb-[6px]">호텔</p>
        <h2 className="text-2xl text-slate-700 font-semibold">
          홀리데이 인 광주 호텔
        </h2>
        <p className="text-sm text-slate-500 flex items-center gap-[6px]">
          <FaLocationDot className=" text-slate-300" />
          광주광역시 서구 상무누리로 55
        </p>
        <ul className="flex items-center gap-[6px]">
          <li>
            <RxStarFilled className="text-primary text-base" />
          </li>
          <li className="text-sm text-slate-700 font-semibold">4.5</li>
          <li className="text-sm text-primary underline">리뷰 252개</li>
          <li className="text-slate-300 text-base mx-1">|</li>
          <li className="text-lg text-slate-400">
            <AiOutlineHeart />
          </li>
          <li className="text-slate-500 text-sm">232</li>
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
