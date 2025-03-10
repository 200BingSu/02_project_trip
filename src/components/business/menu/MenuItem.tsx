import { useState } from "react";
import { BiSolidEditAlt, BiTrash } from "react-icons/bi";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { MenuPic } from "../../../constants/pic";
import { MenuType } from "../../../types/interface";
import BottomSheet from "../../basic/BottomSheet";
import CenterModalTs from "../../common/CenterModalTs";

interface MenuItemProps {
  item: MenuType;
  strfId: number;
  category: string;
}

const MenuItem = ({ strfId, item, category }: MenuItemProps) => {
  // useNavigate
  const navigate = useNavigate();
  const navigateToEditMenu = () => {
    navigate(
      `/business/menu/edit?strfId=${strfId}&category=${category}&menuId=${item.menuId}`,
    );
  };
  // useState
  const [isBottomOpen, setIsBottomOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  // API 메뉴 삭제하기
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

  const actions = [
    {
      label: (
        <div className="flex items-center gap-3 px-4 py-[14px] text-lg text-slate-500">
          <BiSolidEditAlt className="text-slate-300" />
          수정하기
        </div>
      ),
      onClick: () => navigateToEditMenu(),
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
  return (
    <div className="flex items-center justify-between gap-2 py-3">
      {/* 이미지 */}
      <div className="aspect-square w-[21.3vw] max-w-[162px] rounded-lg overflow-hidden bg-slate-200">
        <img
          src={`${MenuPic}/${strfId}/menu/${item.menuPic}`}
          alt={item.menuTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-between w-40">
        {/* 인포 */}
        <div className="flex flex-col gap-2 items-start w-50">
          <p className="text-xl font-semibold text-slate-700 text-left">
            {item.menuTitle}
          </p>
          <p className="text-lg text-slate-500 font-medium text-left">
            {item.menuPrice.toLocaleString()}원
          </p>
        </div>
        {/* 버튼 */}
        <div>
          <button type="button" onClick={handleClickBottom}>
            <CgMoreVerticalAlt className="text-3xl text-slate-500" />
          </button>
        </div>
      </div>
      {isBottomOpen && (
        <BottomSheet
          open={isBottomOpen}
          onClose={handleClickBottom}
          actions={actions}
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
