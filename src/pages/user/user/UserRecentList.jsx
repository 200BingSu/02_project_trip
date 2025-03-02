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

const UserRecentList = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState([]);
  const [isRecents, setIsRecents] = useState([]);
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
  useEffect(() => {
    if (userInfo.accessToken) {
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    getRecentList();
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

      {isRecents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)]">
          <LiaComment className="w-full text-slate-300 text-8xl mb-5 " />
          <p className="text-2xl text-slate-400 font-semibold">
            최근에 본 목록이 없습니다.
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col gap-5 px-8 my-10">
          <div className="flex items-center justify-between w-full h-16">
            <span className=" text-slate-500 mr-auto ">
              최근 본 상품은 최대 10개 까지 출력됩니다.
            </span>
            <Button onClick={showModal} className="px-4 h-8">
              전체 삭제
            </Button>
          </div>
          {isRecents?.map(item => (
            <div
              key={item.strfId}
              onClick={() => handleClickList(item)}
              className="relative w-full flex gap-5 cursor-pointer"
            >
              <p className=" w-32 h-32 overflow-hidden rounded-lg bg-slate-200">
                <img
                  src={`${ProductPic}${item.strfId}/${item.strfPic}`}
                  alt={item.strfTitle}
                  className="w-full h-full object-cover"
                />
              </p>
              <div className="h-28 mt-2">
                <p className="text-slate-700 text-xl font-semibold">
                  {item.strfTitle}
                </p>
                <p className="text-sm text-slate-500 mb-3">
                  {categoryNameMap[item.category]} ⋅ {item.locationName}
                </p>
                {/* <p className="text-slate-700 font-semibold text-lg">
                {item.price}
              </p> */}
                <div>
                  <p className="flex items-center text-slate-400 text-sm gap-1 mb-2">
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={item.ratingAvg}
                      className="custom-rate"
                    />
                    <span>({item.reviewCnt})</span>
                  </p>
                  <p className="flex items-center text-slate-400 text-sm gap-1">
                    {item.wishIn ? (
                      <AiFillHeart className="text-secondary3 text-xl" />
                    ) : (
                      <AiOutlineHeart className="text-slate-400 text-xl" />
                    )}
                    {item.wishCnt}
                  </p>
                </div>
              </div>
              <p
                className="absolute top-3 right-3 text-slate-400"
                onClick={e => {
                  e.stopPropagation(); // 이벤트 버블링 방지
                  deleteRecent(item);
                }}
              >
                삭제
              </p>
            </div>
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
