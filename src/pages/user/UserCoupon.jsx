import { Tabs } from "antd";
import TitleHeader from "../../components/layout/header/TitleHeader";
import "../../styles/antd-styles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LiaComment } from "react-icons/lia";

const categoryArr = ["사용 가능한 쿠폰", "사용 / 만료 된 쿠폰"];

const UserCoupon = () => {
  const [category, setCategory] = useState(0);
  const navigate = useNavigate();

  return (
    <div>
      <TitleHeader icon="back" title="쿠폰함" onClick={() => navigate(-1)} />
      <div>
        <ul className="flex items-center">
          {categoryArr.map((item, index) => {
            return (
              <li
                className={`cursor-pointer w-full flex justify-center items-center
                            pt-[17px] pb-[16px]
                            ${category === index ? `text-primary border-b-[2px] border-primary` : `text-slate-400 border-b border-slate-200`}`}
                key={index}
                onClick={() => {
                  setCategory(index);
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
        <div>
          <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)]">
            <LiaComment className="w-full text-slate-300 text-8xl mb-5 " />
            <p className="text-2xl text-slate-400 font-semibold">
              쿠폰이 없습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCoupon;
