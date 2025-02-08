import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { ProductPic, ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import axios from "axios";
import { Rate } from "antd";
import { AiFillHeart, AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { FaWindowClose } from "react-icons/fa";

const UserRecentList = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState([]);
  const [isRecents, setIsRecents] = useState([]);

  const accessToken = getCookie("accessToken");

  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUseProfile(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("isRecents", isRecents);

  const getRecentList = async () => {
    try {
      const res = await axios.get(`/api/recent/list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsRecents(res.data.data);
      console.log("✅  isRecents:", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const allDeleteRecent = async () => {
    try {
      const res = axios.delete(`/api/recent/hide?strf_id=510`);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const deleteRecent = async item => {
    console.log("isRecents.strfId", item.strfId);
    const sendData = { strf_id: item.strfId };
    try {
      const res = await axios.patch(
        `/api/recent/hide?strf_id=${item.strfId}`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("숨기기 결과", res.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    if (userInfo.accessToken) {
      getUserInfo();
      getRecentList();
    }
  }, []);

  const categoryNameMap = {
    STAY: "숙소",
    RESTAUR: "맛집",
    TOUR: "관광지",
    FEST: "축제",
  };

  const navigate = useNavigate();
  return (
    <div>
      <TitleHeader
        icon="back"
        title="최근 본 목록"
        onClick={() => {
          navigate(-1);
        }}
      />

      <div className="flex flex-wrap gap-4 px-8 my-10">
        {isRecents?.map(item => (
          <div key={item.strfId} className="min-w-52 w-full flex-[1_1_40%]">
            <p className=" w-full h-52 overflow-hidden rounded-lg bg-slate-200">
              <img
                src={`${ProductPic}${item.strfId}${item.strfPic}`}
                alt={item.strfTitle}
                className="w-full h-full object-cover"
              />
            </p>
            <div className="w-full h-28 mt-2">
              <small className="text-sm text-slate-500 font-semibold">
                {categoryNameMap[item.category]} ⋅ {item.locationName}
              </small>
              <p className="text-slate-500 text-lg">{item.strfTitle}</p>
              <p className="text-slate-700 font-semibold text-lg">
                {item.price && null}
              </p>
              <div className="flex items-center gap-3">
                <p className="flex items-center text-slate-400 text-sm gap-1">
                  <AiFillStar className="text-lg text-primary" />
                  {item.ratingAvg}
                </p>
                <p className="flex items-center text-slate-400 text-sm gap-1">
                  {item.wishIn ? (
                    <AiFillHeart className="text-secondary3 text-xl" />
                  ) : (
                    <AiOutlineHeart className="text-slate-400 text-xl" />
                  )}
                  {item.wishCnt}
                </p>
                <FaWindowClose onClick={() => deleteRecent(item)} />
                <button
                  onClick={() => console.log("isRecents", `${item.strfId}`)}
                >
                  Show strfId
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecentList;
