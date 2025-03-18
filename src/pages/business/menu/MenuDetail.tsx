import axios from "axios";
import { useEffect, useState } from "react";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BottomSheet from "../../../components/basic/BottomSheet";
import CenterModalTs from "../../../components/common/CenterModalTs";
import { MenuPic } from "../../../constants/pic";
import { IAPI, IRoom, MenuType } from "../../../types/interface";
import { categoryKor } from "../../../utils/match";

const MenuDetail = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  const category = searchParams.get("category");
  const menuId = searchParams.get("menuId");

  //router
  const navigate = useNavigate();
  const location = useLocation();
  const state: MenuType = location.state;
  console.log("state", state);
  // useState
  const [isBottomOpen, setIsBottomOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [parlor, setParlor] = useState<IRoom | null>(null);
  // API 객실/호실 조회
  const getParlor = async (): Promise<IAPI<IRoom[]> | null> => {
    const url = "/api/detail/parlor";
    try {
      const res = await axios.get<IAPI<IRoom[]>>(
        `${url}?strf_id=${strfId}&category=${categoryKor(category)}`,
      );
      const resultData = res.data;
      console.log("객실/호실 조회", resultData);
      const tempParlor =
        resultData.data.find(item => item.menuId === menuId) ?? null;
      console.log(tempParlor);
      setParlor(tempParlor);
      return resultData;
    } catch (error) {
      console.log("객실/호실 조회", error);
      return null;
    }
  };

  const formatRoomNum = (roomNum: number) => {
    return `${roomNum.toString().padStart(4, "0")}호`;
  };

  useEffect(() => {
    if (parlor) {
      console.log("parlor", parlor);
    }
  }, [parlor]);
  useEffect(() => {
    getParlor();
  }, []);
  const actions = [
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
            객실 추가 정보 수정하기
          </p>
          <p className="text-slate-400 text-base px-6">
            객실 번호, 객실 인원(권장인원, 추가인원), 추가 금액 및<br />{" "}
            편의시설을 수정
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
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-300" />
          삭제하기
        </div>
      ),
      onClick: () => {
        setIsBottomOpen(false);
        setIsDeleteOpen(true);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-3 ">
      {/* 객실 사진 */}
      <section className="flex flex-col gap-3 px-4">
        <div className="flex flex-col">
          <h3 className="text-2xl font-semibold text-slate-700 select-none">
            객실 사진
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
              객실 사진
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
            현재 등록된 객실 정보입니다.
          </p>
        </div>
        <div>
          <ul className="flex flex-col gap-2">
            <li className="grid grid-cols-4 items-center">
              <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                객실 이름
              </h4>
              <p className="col-span-3 text-base text-slate-500">
                {state.menuTitle}
              </p>
            </li>
            <li className="grid grid-cols-4 items-center">
              <h4 className="col-span-1 text-lg text-slate-600 font-semibold">
                객실 번호
              </h4>
              <p className="col-span-3 text-base text-slate-500">
                {formatRoomNum(parlor?.roomNum ?? 0)}
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
          </ul>
        </div>
      </section>
      <BottomSheet
        actions={actions}
        open={isBottomOpen}
        onClose={() => setIsBottomOpen(false)}
      />
      {isDeleteOpen && (
        <CenterModalTs
          title="객실 삭제"
          content="해당 메뉴를 삭제하시겠습니까?"
          handleClickSubmit={() => {
            console.log("삭제");
          }}
          handleClickCancle={() => {
            setIsDeleteOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MenuDetail;
