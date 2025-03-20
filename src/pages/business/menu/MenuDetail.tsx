import { message, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BottomSheet from "../../../components/basic/BottomSheet";
import CenterModalTs from "../../../components/common/CenterModalTs";
import { MenuPic } from "../../../constants/pic";
import { CategoryType } from "../../../types/enum";
import { IAPI, IRoom, MenuType } from "../../../types/interface";
import { categoryKor, matchName } from "../../../utils/match";
import { getCookie } from "../../../utils/cookie";

const MenuDetail = (): JSX.Element => {
  // 쿠키
  const userInfo = getCookie("user");
  const busiNum = userInfo.strfDtos[0].busiNum;
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  const category = searchParams.get("category");
  const menuId = searchParams.get("menuId");

  //router
  const navigate = useNavigate();
  const location = useLocation();
  const state: MenuType = location.state;
  // useState
  const [isBottomOpen, setIsBottomOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState<boolean>(false);
  const [parlor, setParlor] = useState<IRoom | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // API 객실/호실 조회
  const getParlor = async (): Promise<IAPI<IRoom[]> | null> => {
    const url = "/api/detail/parlor";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<IRoom[]>>(
        `${url}?strf_id=${strfId}&category=${categoryKor(category)}`,
      );
      const resultData = res.data;
      const tempParlor =
        resultData.data.find(item => item.menuId === menuId) ?? null;
      setParlor(tempParlor);
      return resultData;
    } catch (error) {
      console.log("객실/호실 조회", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  // API 메뉴 삭제
  const apiDeleteMenu = async () => {
    const url = "/api/detail/menu";
    try {
      const res = await axios.delete(
        `${url}?menuId=${menuId}&busiNum=${busiNum}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setIsDeleteOpen(false);
        navigate(`/business/menu?strfId=${strfId}&category=${category}`);
      }
      console.log("메뉴 삭제", resultData);
    } catch (error) {
      console.log("메뉴 삭제", error);
    }
  };
  // API 객실 삭제
  const deleteRoom = async () => {
    const url = "/api/detail/parlor";
    try {
      const res = await axios.delete(
        `${url}?menuId=${menuId}&busiNum=${busiNum}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        console.log("객실 삭제", resultData);
        setIsDeleteRoomOpen(false);
        message.success("객실 상세 정보 삭제가 완료되었습니다.");
        getParlor();
      }
    } catch (error) {
      console.log("객실 삭제", error);
      setIsDeleteRoomOpen(false);
      message.error("객실 상세 정보 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (parlor) {
    }
  }, [parlor]);
  useEffect(() => {
    getParlor();
  }, []);
  const actionsNoRoom = [
    {
      label: (
        <div className="flex flex-col items-start gap-1 px-4 py-[14px] text-lg text-slate-500">
          <p className="flex items-center gap-3">
            <BiSolidEditAlt className="text-slate-300" />
            객실 기본 정보 수정하기
          </p>
          <p className="text-slate-400 text-base px-6">
            사진, 이름, 가격을 수정
          </p>
        </div>
      ),
      onClick: () => {
        navigate(
          `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${menuId}&what=menu`,
        );
      },
    },
    {
      label: (
        <div className="flex flex-col items-start gap-1 px-4 py-[14px] text-lg text-slate-500">
          <p className="flex items-center gap-3">
            <BiSolidEditAlt className="text-slate-300" />
            객실/호실 등록하기
          </p>
          <p className="text-slate-400 text-base px-6">
            * 예약을 위해 필수적으로 객실/호실 등록이 필요합니다.
          </p>
        </div>
      ),
      onClick: () => {
        navigate(
          `/business/menu/create?strfId=${strfId}&category=${category}&menuId=${menuId}&what=room`,
          { state: parlor },
        );
      },
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-300" />
          {matchName(category)} 삭제하기
        </div>
      ),
      onClick: () => {
        setIsBottomOpen(false);
        setIsDeleteOpen(true);
      },
    },
  ];
  const actionsHasRoom = [
    {
      label: (
        <div className="flex flex-col items-start gap-1 px-4 py-[14px] text-lg text-slate-500">
          <p className="flex items-center gap-3">
            <BiSolidEditAlt className="text-slate-300" />
            객실 기본 정보 수정하기
          </p>
          <p className="text-slate-400 text-base px-6">
            사진, 이름, 가격을 수정
          </p>
        </div>
      ),
      onClick: () => {
        navigate(
          `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${menuId}&what=menu`,
        );
      },
    },
    {
      label: (
        <div className="flex flex-col items-start gap-1 px-4 py-[14px] text-lg text-slate-500">
          <p className="flex items-center gap-3">
            <BiSolidEditAlt className="text-slate-300" />
            객실/호실 수정하기
          </p>
          <p className="text-slate-400 text-base px-6">
            객실 수량, 추가 금액, 권장 인원, 최대 인원 수정
          </p>
        </div>
      ),
      onClick: () => {
        navigate(
          `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${menuId}&what=room`,
          { state: parlor },
        );
      },
    },
    {
      label: (
        <div className="flex flex-col items-start gap-1 px-4 py-[14px] text-lg text-slate-500">
          <p className="flex items-center gap-3">
            <BiTrash className="text-slate-300" />
            객실 삭제하기
          </p>
          <p className="text-slate-400 text-base px-6">
            등록된 해당 객실 정보 모두 삭제
          </p>
        </div>
      ),
      onClick: () => {
        setIsBottomOpen(false);
        setIsDeleteOpen(true);
      },
    },
    {
      label: (
        <div className="flex flex-col items-start gap-1 px-4 py-[14px] text-lg text-slate-500">
          <p className="flex items-center gap-3">
            <BiTrash className="text-slate-300" />
            객실 상세 정보 삭제하기
          </p>
          <p className="text-slate-400 text-base px-6">
            객실 수량, 추가 금액, 권장 인원, 최대 인원 삭제
          </p>
        </div>
      ),
      onClick: () => {
        setIsBottomOpen(false);
        setIsDeleteRoomOpen(true);
      },
    },
  ];
  const actionsOther = [
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          {matchName(category)} 수정하기
        </div>
      ),
      onClick: () => {
        navigate(
          `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${menuId}&what=room`,
          { state: parlor },
        );
      },
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-400" />
          {matchName(category)} 삭제하기
        </div>
      ),
      onClick: () => {
        setIsBottomOpen(false);
        setIsDeleteOpen(true);
      },
    },
  ];
  const matchAtions = () => {
    if (category === CategoryType.STAY && parlor) {
      if (parlor.recomCapacity) {
        return actionsHasRoom;
      } else {
        return actionsNoRoom;
      }
    } else {
      if (parlor) {
        return actionsOther;
      } else {
        return actionsNoRoom;
      }
    }
  };
  return (
    <div className="flex flex-col gap-6 py-3 ">
      {/* 객실 사진 */}
      <section className="flex flex-col gap-3 px-4">
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-slate-700 select-none">
            {matchName(category)} 사진
          </h3>
          <p className="text-base font-medium text-slate-500 select-none">
            현재 고객에게 보여지는 객실 사진입니다.
          </p>
        </div>
        <div className="flex justify-start">
          <div className="max-w-[200px] w-[40vw] aspect-square rounded-lg overflow-hidden bg-slate-100">
            <img
              src={`${MenuPic}/${strfId}/menu/${state.menuPic}`}
              alt={state.menuTitle}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      <div className="h-[10px] bg-slate-100"></div>
      {/* 객실 정보 */}
      <section className="flex flex-col gap-6 px-4">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-slate-700 select-none">
              {matchName(category)} 정보
            </h3>
            <button
              type="button"
              className="text-slate-500 text-2xl select-none"
              onClick={() => setIsBottomOpen(true)}
            >
              <CgMoreVerticalAlt />
            </button>
          </div>

          <p className="text-base font-medium text-slate-500">
            현재 등록된 {matchName(category)} 정보입니다.
          </p>
        </div>
        <div>
          <Spin spinning={isLoading}>
            <ul className="flex flex-col gap-2">
              <li className="grid grid-cols-4 items-center">
                <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                  {matchName(category)} 이름
                </h4>
                <p className="col-span-3 text-base text-slate-500">
                  {state.menuTitle}
                </p>
              </li>
              <li className="grid grid-cols-4 items-center">
                <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                  금액
                </h4>
                <p className="col-span-3 text-base text-slate-500">
                  {state.menuPrice.toLocaleString()}원
                </p>
              </li>

              {!isLoading && parlor !== null && (
                <>
                  <li className="grid grid-cols-4 items-center">
                    <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                      객실 수량
                    </h4>
                    <p className="col-span-3 text-base text-slate-500">
                      {parlor?.roomNum.length}개
                    </p>
                  </li>

                  <li className="grid grid-cols-4 items-center">
                    <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                      추가 금액
                    </h4>
                    <p className="col-span-3 text-base text-slate-500">
                      {parlor?.surcharge.toLocaleString()}원
                    </p>
                  </li>
                  <li className="grid grid-cols-4 items-center">
                    <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                      권장 인원
                    </h4>
                    <p className="col-span-3 text-base text-slate-500">
                      {state.recomCapacity}명
                    </p>
                  </li>
                  <li className="grid grid-cols-4 items-center">
                    <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                      최대 인원
                    </h4>
                    <p className="col-span-3 text-base text-slate-500">
                      {state.maxCapacity}명
                    </p>
                  </li>
                </>
              )}
              {!isLoading &&
                category === CategoryType.STAY &&
                parlor === null && (
                  <>
                    <li>
                      <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                        객실 상세
                      </h4>
                      <p className="col-span-3 text-base text-secondary3">
                        예약을 위해 객실 상세 등록이 필요합니다.
                      </p>
                    </li>
                  </>
                )}
            </ul>
          </Spin>
        </div>
      </section>
      <BottomSheet
        actions={matchAtions()}
        open={isBottomOpen}
        onClose={() => setIsBottomOpen(false)}
      />
      {isDeleteOpen && (
        <CenterModalTs
          title="객실 삭제"
          content={`${matchName(category)}를 삭제하시겠습니까?`}
          handleClickSubmit={() => {
            apiDeleteMenu();
          }}
          handleClickCancle={() => {
            setIsDeleteOpen(false);
          }}
        />
      )}
      {isDeleteRoomOpen && (
        <CenterModalTs
          title="객실 삭제"
          content={`객실 상세 정보를 삭제하시겠습니까?`}
          handleClickSubmit={() => {
            deleteRoom();
          }}
          handleClickCancle={() => {
            setIsDeleteRoomOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MenuDetail;
