import { useState } from "react";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { MenuPic } from "../../../constants/pic";
import { MenuType } from "../../../types/interface";
import BottomSheet from "../../basic/BottomSheet";
import CenterModalTs from "../../common/CenterModalTs";
import { useRecoilState } from "recoil";
import { menuAtom } from "../../../atoms/menuAtom";
import { CategoryType } from "../../../types/enum";
import { matchName } from "../../../utils/match";

interface MenuItemProps {
  item: MenuType;
  strfId: number;
  category: string;
}

const MenuItem = ({ strfId, item, category }: MenuItemProps) => {
  // useNavigate
  const navigate = useNavigate();
  const navigateToCreateRoom = () => {
    navigate(
      `/business/menu/create?strfId=${strfId}&category=${category}&what=room`,
    );
  };
  const navigateToEditMenu = () => {
    navigate(
      `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${item.menuId}&what=menu`,
    );
  };
  const navigateToEditRoom = () => {
    navigate(
      `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${item.menuId}&what=room`,
    );
  };
  const navigateToDetail = () => {
    navigate(
      `/business/menu/detail?strfId=${strfId}&category=${category}&menuId=${item.menuId}`,
      { state: item },
    );
  };
  // recoil
  const [menu, setMenu] = useRecoilState(menuAtom);
  // useState
  const [isBottomOpen, setIsBottomOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const deleteMenu = () => {
    console.log("삭제");
    setIsDeleteOpen(false);
  };
  const handleClickBottom = () => {
    setIsBottomOpen(!isBottomOpen);
  };
  const handleCancleDelete = () => {
    setIsDeleteOpen(false);
  };
  const handleOpenDelete = () => {
    setIsBottomOpen(false);
    setIsDeleteOpen(true);
  };
  const handleClickToEditMenu = () => {
    setMenu({
      ...menu,
      menuTitle: item.menuTitle,
      menuPrice: item.menuPrice,
      menuPic: {
        uid: "1",
        name: item.menuPic,
        status: "done" as const,
        url: `${MenuPic}/${strfId}/menu/${item.menuPic}`,
      },
    });
    console.log("url", `${MenuPic}/${strfId}/menu/${item.menuPic}`);
    navigateToEditMenu();
  };
  const handleClickToEditRoom = () => {
    navigateToEditRoom();
  };
  const actionsHasRoom = [
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          객실 기본 정보 수정하기
        </div>
      ),
      onClick: () => handleClickToEditMenu(),
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          객실 상세 정보 수정하기
        </div>
      ),
      onClick: () => handleClickToEditRoom(),
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-400" />
          {matchName(category)} 삭제하기
        </div>
      ),
      onClick: () => handleOpenDelete(),
    },
  ];
  const actionsNoRoom = [
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          객실/호실 등록하기
        </div>
      ),
      onClick: () => navigateToCreateRoom(),
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          {matchName(category)} 수정하기
        </div>
      ),
      onClick: () => handleClickToEditMenu(),
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-400" />
          삭제하기
        </div>
      ),
      onClick: () => handleOpenDelete(),
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
      onClick: () => handleClickToEditMenu(),
    },
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiTrash className="text-slate-400" />
          삭제하기
        </div>
      ),
      onClick: () => handleOpenDelete(),
    },
  ];
  const matchAtions = () => {
    if (category === CategoryType.STAY) {
      if (item.recomCapacity) {
        return actionsHasRoom;
      } else {
        return actionsNoRoom;
      }
    } else {
      return actionsOther;
    }
  };
  return (
    <div className="flex items-center gap-2 py-3 select-none">
      <section
        className="flex items-center w-full cursor-pointer gap-5"
        onClick={navigateToDetail}
      >
        {/* 이미지 */}
        <div className="aspect-square w-[21.3vw] max-w-[162px] rounded-lg overflow-hidden bg-slate-200">
          <img
            src={`${MenuPic}/${strfId}/menu/${item?.menuPic}`}
            alt={item?.menuTitle}
            className="w-full h-full object-cover"
          />
        </div>
        {/* 인포 */}
        <div className="flex flex-col gap-2 items-start">
          <p className="text-xl font-semibold text-slate-700 text-left">
            {item?.menuTitle}
          </p>
          <div>
            <p className="text-lg text-slate-500 font-medium text-left">
              {item?.menuPrice.toLocaleString()}원
            </p>
            <p
              className={`${!item.recomCapacity && category === CategoryType.STAY ? "visible" : "invisible"} text-slate-500`}
            >
              * 예약을 위해 객실을 등록해주세요.
            </p>
          </div>
        </div>
      </section>
      {/* 버튼 */}
      <div>
        <button type="button" onClick={handleClickBottom}>
          <CgMoreVerticalAlt className="text-3xl text-slate-500" />
        </button>
      </div>
      {isBottomOpen && (
        <BottomSheet
          open={isBottomOpen}
          onClose={handleClickBottom}
          actions={matchAtions()}
          title="더보기"
        />
      )}
      {isDeleteOpen && (
        <CenterModalTs
          title="객실 삭제"
          content="해당 메뉴를 삭제하시겠습니까?"
          handleClickSubmit={deleteMenu}
          handleClickCancle={handleCancleDelete}
        />
      )}
    </div>
  );
};

export default MenuItem;
