import { Button, Form, Input, Modal, Tooltip } from "antd";
import axios from "axios";
import { memo, useEffect, useMemo, useState } from "react";
import { AiOutlinePlus, AiOutlineQuestionCircle } from "react-icons/ai";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { FaRegQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import jwtAxios from "../../apis/jwt";
import { userAtom } from "../../atoms/userAtom";
import BottomSheet from "../../components/basic/BottomSheet";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { LocationPic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";
import Footer from "../Footer";
import "../../styles/antd-styles.css";
import DockBar from "../../components/layout/DockBar/DockBar";
import dayjs from "dayjs";
import { duration } from "../../utils/duration";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";

const categoryArr = ["다가오는 여행", "완료된 여행"];
const UserTrips = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState({});
  const [tripListData, setTripListData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();
  const accessToken = getCookie("accessToken");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState(0);

  useEffect(() => {
    // console.log("tripListData", tripListData);
  }, [tripListData]);

  useEffect(() => {}, [category]);

  // 여행 목록 불러오기
  const getTripList = async () => {
    try {
      const res = await jwtAxios.get(`/api/trip-list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      //   console.log(res.data);
      const resultData = res.data;
      const beforeArr = resultData.beforeTripList;
      const afterArr = resultData.afterTripList;

      setTripListData(resultData.data);
    } catch (error) {
      console.log("여행 목록 불러오기:", error);
    }
  };

  // 구성원 추가
  const postTripUser = async () => {
    const sendData = {
      inviteKey: code,
    };
    try {
      const res = await axios.post(`/api/trip/user`, sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // console.log("구성원추가", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        navigate(`/schedule/index?tripId=${resultData.data}`);
      }
    } catch (error) {
      console.log("구성원 추가", error);
    }
  };
  // 유저 데이터 불러오기
  const getUserInfo = async () => {
    try {
      const res = await jwtAxios.get(`/api/user/userInfo`);
      // console.log(res.data);
      const resultData = res.data;
      setUseProfile(resultData.data);
    } catch (error) {
      console.log("유저 정보", error);
    }
  };
  useEffect(() => {
    if (accessToken) {
      getTripList();
      getUserInfo();
    }
  }, []);
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateGoTrip = item => {
    console.log(item);
    navigate(`/schedule/index?tripId=${item.tripId}`);
  };

  useEffect(() => {
    // console.log("카테고리", category);
  }, [category]);
  // 미완료 여행 목록 불러오기

  //antD 툴팁 설정
  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  const actions = [
    {
      label: "여행 일정 추가하기",
      onClick: () => console.log("수정하기 클릭"),
    },
    {
      label: "초대코드 입력하기",
      onClick: () => {
        setIsModalOpen(true);
        setIsOpen(false);
      },
    },
  ];
  const tripMore = [
    {
      label: (
        <>
          <BiSolidEditAlt /> 해당 일정 수정하기
        </>
      ),
      onClick: () => console.log("수정하기 클릭"),
    },
    {
      label: (
        <>
          <BiTrash /> 해당 일정 삭제하기
        </>
      ),
      onClick: () => {
        setIsModalOpen(true);
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <TitleHeader icon="back" title="여행" onClick={navigateBack} />
      {/* 여행 일정 만들기 */}
      <div
        className="w-auto h-auto p-5 bg-slate-50 rounded-lg flex items-center gap-5 mx-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <i className="inline-block p-[10px] bg-primary rounded-full">
          <AiOutlinePlus className="text-white" />
        </i>
        <div>
          <p className="text-lg text-slate-700 font-semibold">
            여행 일정 만들기
          </p>
          <p className="text-sm text-slate-500 tracking-tight">
            새로운 여행 일정을 만들어 보세요 !
          </p>
        </div>
      </div>

      {/* 여행 목록 */}
      <div className="px-4">
        {/* 다가오는 여행 */}
        <h1 className="text-xl font-semibold text-slate-700 mt-5">
          다가오는 여행
        </h1>
        <ul className="flex flex-col">
          {tripListData?.beforeTripList?.map((item, index) => {
            return (
              <li
                className="flex items-center justify-between py-5"
                key={index}
                onClick={() => {
                  navigateGoTrip(item);
                }}
              >
                {/* 좌측 */}
                <div className="flex items-center gap-3">
                  {/* 이미지 */}
                  <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden">
                    <img
                      src={`${LocationPic}${item.locationPic}`}
                      alt={item.title}
                      className="w-full h-full"
                    />
                  </div>
                  {/* 정보 */}
                  <div className="flex flex-col">
                    <h3 className="text-base text-slate-700 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      <span className="ml-1">
                        ({duration(item)}박{duration(item) + 1}일)
                      </span>
                    </p>
                  </div>
                </div>
                {/* 우측 */}

                <CgMoreVerticalAlt
                  className="text-3xl text-slate-500"
                  onClick={e => {
                    e.stopPropagation();
                    setIsOpen(true);
                  }}
                />
                <BottomSheet
                  open={isOpen}
                  onClose={() => setIsOpen(false)}
                  actions={actions}
                />
              </li>
            );
          })}
        </ul>
        <h1 className="text-xl font-semibold text-slate-700 mt-5">
          완료된 여행
        </h1>
        <ul className="flex flex-col">
          {/* 완료된 여행 */}
          {tripListData.afterTripList?.map((item, index) => {
            return (
              <li
                className="flex items-center justify-between py-5"
                key={index}
                onClick={() => {
                  navigateGoTrip(item);
                }}
              >
                {/* 좌측 */}
                <div className="flex items-center gap-3">
                  {/* 이미지 */}
                  <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden">
                    <img
                      src={`${LocationPic}${item.locationPic}`}
                      alt={item.title}
                      className="w-full h-full"
                    />
                  </div>
                  {/* 정보 */}
                  <div className="flex flex-col">
                    <h3 className="text-base text-slate-700 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      <span>{item.startAt}</span>~
                      <span>
                        {item.endAt}
                        <span className="ml-1">
                          ({duration(item)}박{duration(item) + 1}일)
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                {/* 우측 */}

                <CgMoreVerticalAlt className="text-3xl text-slate-500" />
              </li>
            );
          })}
        </ul>
      </div>
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={actions}
      />
      <BottomSheet
        open={isOpen}
        onClose={() => setIsOpen(false)}
        actions={tripMore}
      />
      <Footer />

      <Modal
        className="custom-modal-invite"
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        {/* 여행코드 입력창 */}
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-1">
            <p className="text-slate-700 text-xs font-semibold">
              초대코드 입력
            </p>
            {/* <Button type="Outlined" className="group flex items-center focus:">
              <AiOutlineQuestionCircle className="text-xs text-slate-300 group-hover:text-[#b8c8d1] transition-all duration-300" />
              <p className="text-slate-300  text-[8px] overflow-hidden transition-all duration-300"></p>
            </Button> */}
            <Tooltip
              placement="right"
              className="custom-tooltip"
              title={
                <span className="text-[10px]">
                  친구에게 받은 일정코드를 입력하시고 함께 여행 일정을
                  만들어주세요
                </span>
              }
            >
              <AiOutlineQuestionCircle className="text-sm text-slate-400" />
            </Tooltip>
          </div>

          <Input
            placeholder="친구와 여행을 함께하기 위해 코드를 입력해주세요"
            className=" py-[20px] h-[79px]"
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => {
              if (e.code === "Enter") {
                postTripUser();
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default memo(UserTrips);
