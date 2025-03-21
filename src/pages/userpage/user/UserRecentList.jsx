import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillHeart, AiFillStar, AiOutlineHeart } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { ProductPic } from "../../../constants/pic";
import { getCookie } from "../../../utils/cookie";
import { Button, Modal, Rate } from "antd";
import { LiaComment } from "react-icons/lia";
import Footer from "../../Footer";
import "../../../styles/antd-styles.css";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import jwtAxios from "../../../apis/jwt";

const UserRecentList = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState([]);
  const [isRecents, setIsRecents] = useState([]);
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const res = await axios.patch(
        `/api/recent/hide/all`,
        {}, // Body 추가
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      getRecentList();
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const deleteRecent = async item => {
    console.log("isRecents.strfId", item.strfId, accessToken);

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

      getRecentList(); // Call getRecentList after deleting
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  const getCount = async () => {
    try {
      const res = await jwtAxios.get(`/api/recent/count`);
      setCount(res.data); // 숫자 그대로 할당
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (userInfo.accessToken) {
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    getRecentList();
    getCount();
  }, []);

  const handleClickList = item => {
    console.log("클릭된 아이템", item);
    navigate(`/contents/index?strfId=${item.strfId}`);
  };

  const categoryNameMap = {
    STAY: "숙소",
    RESTAUR: "맛집",
    TOUR: "관광지",
    FEST: "축제",
  };

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => {
    allDeleteRecent();
    setIsModalOpen(false);
  };
  const handleCancel = () => setIsModalOpen(false);
  const categoryArr = {
    TOUR: "관광지",
    FEST: "축제",
    STAY: "숙소",
    RESTAUR: "맛집",
  };

  const navigate = useNavigate();

  console.log(" count", count);
  return (
    <div>
      <TitleHeader
        icon="back"
        title="최근 본 목록"
        onClick={() => {
          navigate(-1);
        }}
      />

      {isRecents.length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <LiaComment className="w-full text-slate-300 text-8xl mb-5 " />
          <p className="text-2xl text-slate-400 font-semibold">
            최근에 본 목록이 없습니다.
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-6 px-4 mb-6">
          <div className="flex justify-between py-[14px] border-b-[1px] border-slate-100 ">
            <p className="text-sm font-semibold text-slate-700">총 {count}개</p>

            <button
              onClick={showModal}
              className="text-sm font-light text-slate-400"
            >
              전체 삭제
            </button>
          </div>
          {isRecents?.map(item => (
            <li
              className="flex gap-3 items-start cursor-pointer"
              key={item.strfId}
              onClick={() => navigate(`/contents/index?strfId=${item.strfId}`)}
            >
              {/* 썸네일 */}
              <div className="w-32 min-w-32 aspect-square bg-slate-200 rounded-lg overflow-hidden relative">
                <img
                  src={`${ProductPic}/${item.strfId}/${item.strfPic}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 정보 */}
              <div className="flex flex-col gap-[5px] mr-auto">
                {/* 제목, 지역 제휴 */}
                <div className="flex gap-[5px] items-center ">
                  <h3 className="text-lg font-medium text-slate-700">
                    {item.strfTitle}
                  </h3>
                </div>
                {/* 카테고리, 지역 */}
                <div>
                  <p className="text-sm text-slate-500">
                    {categoryArr[item.category] || item.category} ·{" "}
                    {item.locationName}
                  </p>
                </div>
                {/* 별점 */}
                <div className="flex gap-1 items-center">
                  <Rate
                    disabled
                    allowHalf
                    value={item.ratingAvg}
                    className="flex items-center custom-star-wish custom-star"
                  />
                  <p className="text-sm text-slate-500">
                    ({item.reviewCnt?.toLocaleString()})
                  </p>
                </div>
                {/* 찜하기 */}
                <div className="flex gap-1 items-center text-sm">
                  {item.wishIn === 1 ? (
                    <AiFillHeart className="text-secondary3 text-lg" />
                  ) : (
                    <AiOutlineHeart className="text-slate-400 text-lg" />
                  )}
                  <p className="text-slate-500">
                    {item.wishCnt?.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={e => {
                  e.stopPropagation(); // 이벤트 버블링 방지
                  deleteRecent(item);
                }}
                className="text-slate-400 text-sm w-9 text-right"
              >
                삭제
              </button>
            </li>
          ))}
        </div>
      )}
      <Footer />
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        footer={[
          <div className="flex items-center">
            <Button
              key="back"
              onClick={handleCancel}
              className="w-full h-14 border-0 rounded-none shadow-none"
            >
              취소
            </Button>
            <span className="text-slate-300 font-thin">|</span>
            <Button
              key="submit"
              onClick={handleOk}
              className="w-full h-14 border-none shadow-none"
            >
              확인
            </Button>
          </div>,
        ]}
      >
        <p className="text-lg text-slate-700 font-semibold text-center py-6">
          최근 본 목록을 전체 삭제하시겠습니까 ?
        </p>
      </Modal>
    </div>
  );
};

export default UserRecentList;
