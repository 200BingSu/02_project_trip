import { useState } from "react";
import { AiFillSetting, AiOutlinePlus, AiOutlineStar } from "react-icons/ai";
import { BiBell, BiSolidCoupon } from "react-icons/bi";
import { GoDiscussionOutdated } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { tsUserAtom } from "../../../atoms/tsuserAtom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { CategoryType, ROLE } from "../../../types/enum";
import { getCookie, removeCookie, setCookie } from "../../../utils/cookie";
import {
  categoryToEnum,
  matchcategoryIcon,
  matchMenuIcon,
  matchName,
} from "../../../utils/match";
import { salesAtom } from "../../../atoms/salesAtom";
import axios from "axios";
import { IAPI } from "../../../types/interface";

const Mypage = (): JSX.Element => {
  // useNavigate
  const navigate = useNavigate();
  const navigateToChatRoom = (roomId: string | number) => {
    navigate(`/chatroom?roomId=${roomId}`);
  };
  // 쿠키
  const userInfo = getCookie("user");
  const accessToken = getCookie("accessToken");
  console.log("쿠키", userInfo);
  const strfId = userInfo?.strfDtos[0].strfId;
  const category =
    categoryToEnum(userInfo?.strfDtos[0].category) || CategoryType.STAY;
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
      // 메뉴 관리
      icon: matchMenuIcon(category),
      name: `${matchName(category)} 관리`,
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
    if (isOpenMenu === false) {
      if (openMenu === index) {
        setIsOpenMenu(true);
      }
      if (openMenu !== index) {
        setOpenMenu(index);
        setIsOpenMenu(true);
      }
    }
    if (isOpenMenu === true) {
      setIsOpenMenu(false);
    }
  };
  // 옵션 메뉴 열기
  const handleOpenOption = (index: number) => {
    if (isOpenOption === false) {
      if (openOption === index) {
        setIsOpenOption(true);
      }
      if (openOption !== index) {
        setOpenOption(index);
        setIsOpenOption(true);
      }
    }
    if (isOpenOption === true) {
      setIsOpenOption(false);
    }
  };
  // 로그아웃
  const handleLogout = () => {
    resetUserData();
    resetSalesData();
    removeCookie("accessToken");
    const userInfo = getCookie("user");
    if (userInfo.isSaveEmail === false) {
      setCookie("user", { ...userInfo, email: "" });
    }
    if (userInfo.isSaveLogin === false) {
      setCookie("user", {
        ...userInfo,
        userId: "",
        email: "",
        accessToken: "",
        role: [ROLE.GUEST],
      });
    }

    navigate("/signin");
  };
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
            <button type="button">
              <AiFillSetting />
            </button>
          </div>
        }
      />
      <div className="flex flex-col gap-5">
        {/* 사장님 프로필 */}
        <div className="flex items-end justify-between px-5 pt-5 ">
          <div className="text-2xl text-slate-700 flex items-end gap-2">
            <span className="text-3xl font-semibold line-clamp-1">
              {recoilInfo?.name}
            </span>{" "}
            님
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
                    className="flex items-center gap-4 text-2xl font-medium text-slate-700"
                  >
                    <i className="text-2xl text-slate-400">{item.icon}</i>
                    {item.name}
                    {item.subMenu && (
                      <i
                        className={`text-2xl text-slate-500 ${
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
                      hover:bg-slate-100 transition-all duration-300"
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
                    className={`flex items-center gap-4 text-2xl font-medium text-slate-700
                      ${category === CategoryType.STAY ? "" : "hidden"}`}
                  >
                    <i className="text-2xl text-slate-400">
                      <GoDiscussionOutdated />
                    </i>
                    {item.name}
                    {item.subMenu && (
                      <i
                        className={`text-2xl text-slate-500 ${
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
                          className="px-10 text-xl text-slate-500 py-1 cursor-pointer"
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

export default Mypage;
