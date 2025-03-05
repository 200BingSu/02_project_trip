import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { useState } from "react";
import Point from "../../../components/user/Point";

const UserPoint = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    if (isOpen === true) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <TitleHeaderTs icon="back" title="포인트" onClick={() => navigate(-1)} />
      <div>
        <div className="mx-4 my-6">
          <div>
            <h3 className="text-base text-slate-500 mb-[6px]">
              닉네임님의 보유 <span className="text-primary">포인트</span>
            </h3>
            <h1 className="text-4xl font-semibold text-slate-700">
              2,351
              <span className="font-light text-slate-500 ml-3">P</span>
            </h1>
          </div>
          <div className="flex py-6 border-[1px] border-slate-200 rounded-lg mt-4">
            <div
              className="flex flex-col flex-1 items-center gap-[6px] border-r-[1px] border-slate-100 cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <img
                src="/public/images/icon/IoQrCode.svg"
                alt="IoQrCode"
                className="w-6 aspect-square"
              />
              <p className="text-sm text-slate-700">QR/스마트 결제</p>
            </div>
            <div className="flex flex-col flex-1 items-center gap-[6px] cursor-pointer">
              <img
                src="/public/images/icon/AiOutlinePlusCircle.svg"
                alt="AiOutlinePlusCircle"
                className="w-6 aspect-square"
              />
              <p className="text-sm text-slate-700">포인트 충전</p>
            </div>
          </div>
        </div>
        <ul className="px-4">
          <li className="flex justify-between py-4 ">
            <p className="text-base text-slate-700 font-semibold">
              적립/사용내역
            </p>
            <button className="flex items-center gap-[6px] text-base text-slate-500">
              전체
              <IoIosArrowDown className="text-slate-400 text-sm" />
            </button>
          </li>
          <li className="flex justify-between py-4">
            <div>
              <p className="text-slate-700 text-base mb-[2px]">스톤크릭 카페</p>
              <p className="text-slate-400 text-sm">2025-10-24 15:27:40</p>
            </div>
            <div>
              <p className="text-slate-700 text-lg font-semibold mb-[2px]">
                -6,500P
              </p>
              <p className="text-slate-400 text-sm">2,351P</p>
            </div>
          </li>
        </ul>
      </div>
      {isOpen && <Point handleClose={handleClose} />}
    </div>
  );
};

export default UserPoint;
