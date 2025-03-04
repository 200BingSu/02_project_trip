import { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { GoDiscussionOutdated } from "react-icons/go";
import { IoIosArrowForward } from "react-icons/io";
import { RxExit } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { removeCookie } from "../../../utils/cookie";

// 현재 상품 id (임시)
const strfId = 1;

const Mypage = (): JSX.Element => {
  const navigate = useNavigate();
  // recoil
  const resetUserData = useResetRecoilState(userAtom);
  const navigateToBusiness = () => {
    navigate("/business");
  };
  // useState
  const [openMenu, setOpenMenu] = useState<number>(0);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  // 메뉴
  const menuArr = [
    {
      name: "가게 관리",
      path: `/business/store`,
      subMenu: [
        {
          name: "기본 정보",
          path: `/business/store?strfId=${strfId}&tab=basic`,
        },
        {
          name: "운영정보",
          path: `/business/store?strfId=${strfId}&tab=operation`,
        },
      ],
    },
    {
      name: "메뉴 관리",
      path: "/business/menu",
      subMenu: [
        { name: "메뉴 목록", path: `/business/menu?strfId=${strfId}` },
        { name: "메뉴 등록", path: `/business/menu/create?strfId=${strfId}` },
      ],
    },

    {
      name: "쿠폰 관리",
      path: "/business/coupon",
      subMenu: [
        { name: "쿠폰 목록", path: `/business/coupon?strfId=${strfId}` },
        {
          name: "쿠폰 발급",
          path: `/business/coupon/create?strfId=${strfId}`,
        },
      ],
    },
    { name: "예약 관리", path: `/business/booking?strfId=${strfId}` },
    { name: "리뷰 관리", path: `/business/review?strfId=${strfId}` },
  ];
  // 관리 메뉴
  const manageMenuArr = [
    { name: "공지사항", path: "" },
    { name: "자주 묻는 질문", path: "" },
    { name: "고객센터", path: "" },
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
  // 로그아웃
  const handleLogout = () => {
    removeCookie("accessToken");
    removeCookie("user");
    resetUserData();
    navigate("/business");
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
          <div className="text-2xl text-slate-700">
            <span className="text-3xl font-semibold ">사장님 이름 </span>님
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate("/business/register")}
            >
              + 업체 등록
            </button>
          </div>
        </div>

        {/* 라인 */}
        <div className="w-full h-[2.67vw] max-h-[10px] bg-slate-100"></div>
        {/* 메뉴 */}
        <ul className="flex flex-col gap-5 px-6">
          {menuArr.map((item, index) => (
            <li key={index} className="py-4">
              <button
                type="button"
                onClick={() => {
                  item.subMenu ? handleOpenMenu(index) : navigate(item.path);
                }}
                className="flex items-center gap-4 text-2xl font-medium text-slate-700"
              >
                <i className="text-2xl text-slate-400">
                  <GoDiscussionOutdated />
                </i>
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
                  className={`flex flex-col gap-2 py-4 ${
                    openMenu === index && isOpenMenu === true
                      ? "visible h-auto opacity-100 relative"
                      : "invisible max-h-0 opacity-0 absolute"
                  } overflow-hidden transition-[max-height] duration-300 ease-in-out opacity-transition`}
                  style={{
                    transitionProperty: "opacity, max-height, visibility",
                    transitionDuration: openMenu === index ? "400ms" : "300ms",
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
        </ul>
        {/* 라인 */}
        <div className="w-full h-[2.67vw] max-h-[10px] bg-slate-100"></div>
        {/* 관리 메뉴 */}
        <ul className="py-5 px-6">
          {manageMenuArr.map((item, index) => {
            return (
              <li
                key={index}
                className="cursor-pointer text-slate-500 py-3 text-lg"
                onClick={() => navigate(item.path)}
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
