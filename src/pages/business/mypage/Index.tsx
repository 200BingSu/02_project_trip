import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillSetting, AiOutlinePlus, AiOutlineStar } from "react-icons/ai";
import { BiBell, BiCoin, BiSolidCoupon } from "react-icons/bi";
import { GoDiscussionOutdated } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { salesAtom } from "../../../atoms/salesAtom";
import { tsUserAtom } from "../../../atoms/tsuserAtom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { ProfilePic } from "../../../constants/pic";
import { CategoryType, ROLE } from "../../../types/enum";
import { IAPI } from "../../../types/interface";
import { getCookie, removeCookie, setCookie } from "../../../utils/cookie";
import {
  categoryToEnum,
  matchcategoryIcon,
  matchMenuIcon,
  matchName,
} from "../../../utils/match";

const Index = (): JSX.Element => {
  // useNavigate
  const navigate = useNavigate();
  const navigateToChatRoom = (roomId: string | number) => {
    navigate(`/chatroom?roomId=${roomId}`);
  };
  // 쿠키
  const userInfo = getCookie("user");
  const accessToken = getCookie("accessToken");
  // console.log("쿠키", userInfo);
  const strfId = userInfo?.strfDtos[0]?.strfId;
  const category =
    categoryToEnum(userInfo?.strfDtos[0]?.category) || CategoryType.STAY;
  // recoil
  const resetUserData = useResetRecoilState(tsUserAtom);
  const resetSalesData = useResetRecoilState(salesAtom);
  const recoilInfo = useRecoilValue(tsUserAtom);
  const navigateToBusiness = () => {
    navigate("/business");
  };
  // useState
  const [openMenu, setOpenMenu] = useState<number>(0);
  const [openOption, setOpenOption] = useState<number>(0);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isOpenOption, setIsOpenOption] = useState<boolean>(false);
  const [useProfile, setUseProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // api 유저 정보 조회
  const getUserInfo = async () => {
    const url = "/api/user/userInfo";
    setIsLoading(true);
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        setUseProfile(resultData.data);
      }
      // console.log("유저 정보", resultData);
    } catch (error) {
      console.log("유저 정보 조회", error);
    } finally {
      setIsLoading(false);
    }
  };
  // API 관리자 채팅방 생성
  const createChatToAdmine = async (): Promise<IAPI<
    string | number
  > | null> => {
    const url = "/api/chat-room/admin";
    try {
      const res = await axios.post<IAPI<string | number>>(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("관리자 채팅방 생성", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        navigateToChatRoom(resultData.data);
      }
      return resultData;
    } catch (error) {
      console.log("관리자 채팅방 생성", error);
      return null;
    }
  };

  // 메뉴
  const mainMenuArr = [
    {
      icon: matchcategoryIcon(category),
      name: "가게 관리",
      path: `/business/store`,
      subMenu: [
        {
          name: "기본 정보",
          path: `/business/store?strfId=${strfId}&category=${category}&tab=0`,
        },
        {
          name: "운영정보",
          path: `/business/store?strfId=${strfId}&category=${category}&tab=1`,
        },
      ],
    },
    {
      icon: matchMenuIcon(category),
      name: `${matchName(category)} 관리`, // 메뉴 관리
      path: "/business/menu",
      subMenu: [
        {
          name: `${matchName(category)} 목록`,
          path: `/business/menu?strfId=${strfId}&category=${category}`,
        },
        {
          name: `${matchName(category)} 등록`,
          path: `/business/menu/create?strfId=${strfId}&category=${category}`,
        },
      ],
    },
    {
      icon: <AiOutlineStar />,
      name: "리뷰 관리",
      path: `/business/review?strfId=${strfId}`,
    },
    {
      icon: <BiCoin />,
      name: "포인트 관리",
      path: `/business/point`,
      subMenu: [
        {
          name: `포인트 입금 내역`,
          path: `/business/point?strfId=${strfId}`,
        },
        {
          name: `포인트 QR 생성`,
          path: `/business/point/qr?strfId=${strfId}`,
        },
      ],
    },
  ];
  // 상품 카테고리 별 메뉴
  const optionMenuArr = [
    {
      icon: <BiSolidCoupon />,
      name: "쿠폰 관리",
      path: "/business/coupon",
      subMenu: [
        { name: "쿠폰 목록", path: `/business/coupon?strfId=${strfId}` },
        {
          name: "쿠폰 발급",
          path: `/business/coupon/create?strfId=${strfId}`,
        },
      ],
      category: [CategoryType.STAY],
    },
    {
      icon: <GoDiscussionOutdated />,
      name: "예약 관리",
      path: `/business/booking?strfId=${strfId}`,
      category: [CategoryType.STAY],
    },
  ];
  // 관리 메뉴
  const manageMenuArr = [
    {
      name: "공지사항",
      onClick: () => navigate("/announcement?type=business"),
    },
    {
      name: "자주 묻는 질문",
      onClick: () => navigate("/qna"),
    },
    { name: "관리자에게 문의하기", onClick: () => createChatToAdmine() },
  ];
  // 메뉴 열기
  const handleOpenMenu = (index: number) => {
    if (openMenu === index) {
      if (isOpenOption) {
        setIsOpenOption(false);
      }
      setIsOpenMenu(!isOpenMenu);
    } else {
      setOpenMenu(index);
    }
  };
  // 옵션 메뉴 열기
  const handleOpenOption = (index: number) => {
    if (openOption === index) {
      if (isOpenMenu) {
        setIsOpenMenu(false);
      }
      setIsOpenOption(!isOpenOption);
    } else {
      setOpenOption(index);
    }
  };

  // 로그아웃
  const handleLogout = () => {
    resetUserData();
    resetSalesData();
    removeCookie("accessToken");
    const userInfo = getCookie("user");

    if (userInfo.isSaveEmail === false) {
      setCookie("user", {
        ...userInfo,
        email: "",
        role: [ROLE.GUEST],
        strfDtos: [],
      });
    } else {
      setCookie("user", {
        ...userInfo,
        role: [ROLE.GUEST],
        strfDtos: [],
      });
    }
    // if (userInfo.isSaveLogin === false) {
    //   setCookie("user", {
    //     ...userInfo,
    //     userId: "",
    //     email: "",
    //     accessToken: "",
    //     role: [ROLE.GUEST],
    //   });
    // }

    navigate("/signin");
  };
  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="flex flex-col gap-5">
      <TitleHeaderTs
        icon="close"
        title=""
        onClick={navigateToBusiness}
        rightContent={
          <div className="flex items-center gap-5">
            <button type="button">
              <BiBell />
            </button>
            <button
              type="button"
              onClick={() => navigate("/business/mypage/edit")}
            >
              <AiFillSetting />
            </button>
          </div>
        }
      />
      <div className="flex flex-col gap-5">
        {/* 사장님 프로필 */}
        <div className="flex flex-col items-center gap-5 px-5 pt-5 pb-4 ">
          {isLoading && (
            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-slate-100"></div>
          )}
          {!isLoading && (
            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-slate-100">
              <img
                src={`${ProfilePic}/${userInfo?.userId}/${useProfile?.profilePic}`}
                alt="User-Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="text-2xl text-slate-700 flex items-end gap-2">
            {isLoading && <span className="text-transparent">닉네임</span>}
            {!isLoading && (
              <span className="text-3xl font-semibold line-clamp-1">
                {recoilInfo?.name}
              </span>
            )}
          </div>
        </div>
        {/* 라인 */}
        <div className="w-full h-[2.67vw] max-h-[10px] bg-slate-100"></div>
        {/* 메뉴 */}
        <ul className="flex flex-col gap-5 px-6">
          {strfId ? (
            <>
              {mainMenuArr.map((item, index) => (
                <li key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => {
                      item.subMenu
                        ? handleOpenMenu(index)
                        : navigate(item.path);
                    }}
                    className="w-full flex items-center justify-between gap-4 text-2xl font-medium text-slate-700 "
                  >
                    <div className="flex items-center gap-3">
                      <i className="text-2xl text-slate-400">{item.icon}</i>
                      {item.name}
                    </div>

                    {item.subMenu && (
                      <i
                        className={`text-2xl text-slate-300 ${
                          openMenu === index && isOpenMenu === true
                            ? "rotate-90"
                            : "rotate-0"
                        } transition-transform duration-300`}
                      >
                        <IoIosArrowForward />
                      </i>
                    )}
                  </button>
                  {item.subMenu && (
                    <ul
                      className={`flex flex-col py-4 ${
                        openMenu === index && isOpenMenu === true
                          ? "visible h-auto opacity-100 relative"
                          : "invisible max-h-0 opacity-0 absolute"
                      } overflow-hidden transition-[max-height] duration-300 ease-in-out opacity-transition`}
                      style={{
                        transitionProperty: "opacity, max-height, visibility",
                        transitionDuration:
                          openMenu === index ? "400ms" : "300ms",
                      }}
                    >
                      {item.subMenu.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="px-10 py-2 text-xl text-slate-500 cursor-pointer
                      hover:bg-slate-100 transition-all duration-300 flex items-center justify-between"
                          onClick={() => navigate(subItem.path)}
                        >
                          {subItem.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {/* 옵션 메뉴 */}
              {optionMenuArr.map((item, index) => (
                <li key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => {
                      item.subMenu
                        ? handleOpenOption(index)
                        : navigate(item.path);
                    }}
                    className={`w-full flex items-center justify-between gap-4 text-2xl font-medium text-slate-700
                      ${category === CategoryType.STAY ? "" : "hidden"}`}
                  >
                    <div className="flex items-center gap-4">
                      <i className="text-2xl text-slate-400">{item.icon}</i>
                      {item.name}
                    </div>

                    {item.subMenu && (
                      <i
                        className={`text-2xl text-slate-300 ${
                          openOption === index && isOpenOption === true
                            ? "rotate-90"
                            : "rotate-0"
                        } transition-transform duration-300`}
                      >
                        <IoIosArrowForward />
                      </i>
                    )}
                  </button>
                  {item.subMenu && (
                    <ul
                      className={`flex flex-col gap-2 py-4 ${
                        openOption === index && isOpenOption === true
                          ? "visible h-auto opacity-100 relative"
                          : "invisible max-h-0 opacity-0 absolute"
                      } overflow-hidden transition-[max-height] duration-300 ease-in-out opacity-transition`}
                      style={{
                        transitionProperty: "opacity, max-height, visibility",
                        transitionDuration:
                          openOption === index ? "400ms" : "300ms",
                      }}
                    >
                      {item.subMenu.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="px-10 text-xl text-slate-500 py-1 cursor-pointer "
                          onClick={() => navigate(subItem.path)}
                        >
                          {subItem.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </>
          ) : (
            <li className="py-4 flex items-center gap-4 text-2xl font-medium text-slate-700">
              <i className="text-2xl text-slate-400">
                <AiOutlinePlus />
              </i>
              업체 등록
            </li>
          )}
          {/* 메인메뉴 */}
        </ul>
        {/* 라인 */}
        <div className="w-full h-[2.67vw] max-h-[10px] bg-slate-100"></div>
        {/* 관리 메뉴 */}
        <ul className="py-5 px-6">
          {manageMenuArr.map((item, index) => {
            return (
              <li
                key={index}
                className="cursor-pointer text-slate-500 py-3 text-lg select-none"
                onClick={item.onClick}
              >
                {item.name}
              </li>
            );
          })}
          <li
            className="cursor-pointer text-slate-500 py-3 text-lg flex items-center gap-2"
            onClick={handleLogout}
          >
            <RxExit className="text-slate-300" />
            로그아웃
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Index;
