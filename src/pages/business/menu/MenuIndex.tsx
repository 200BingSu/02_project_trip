import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuItem from "../../../components/business/menu/MenuItem";
import { MenuType } from "../../../types/interface";
import { LiaComment } from "react-icons/lia";

interface IGetMenuListRes {
  code: string;
  data: MenuType[];
}

const MenuIndex = (): JSX.Element => {
  // navigate
  const navigate = useNavigate();
  const navigateToCreateMenu = () => {
    navigate(`/business/menu/create?strfId=${strfId}&category=${category}`);
  };
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const category = searchParams.get("category");
  // useState
  const [menuList, setMenuList] = useState<MenuType[]>([]);

  // API 메뉴 목록
  const getMenuList = async (): Promise<IGetMenuListRes | null> => {
    const url = "/api/detail/menu";
    try {
      const res = await axios.get<IGetMenuListRes>(`${url}?strf_id=${strfId}`);
      const resultData = res.data;
      if (resultData.data[0] !== null) {
        setMenuList(resultData.data);
      }

      return resultData;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  useEffect(() => {
    getMenuList();
  }, []);
  return (
    <div className="px-4 flex flex-col gap-3 pb-3">
      {/* 버튼 */}
      <section className="flex justify-end">
        <Button
          size="large"
          onClick={navigateToCreateMenu}
          className="text-base font-semibold text-slate-500 px-4 flex items-center gap-3"
        >
          <AiOutlinePlus />
          메뉴 추가
        </Button>
      </section>
      {/* 메뉴 목록 */}
      <section>
        <ul className="flex flex-col gap-3">
          {menuList.length > 0 &&
            menuList?.map((item, index) => (
              <MenuItem
                item={item}
                key={index}
                strfId={strfId}
                category={category as string}
              />
            ))}
          {menuList.length === 0 && (
            <li className="flex flex-col gap-5 items-center justify-center text-slate-300 py-12">
              <LiaComment className="text-7xl" />
              <p className="text-2xl">메뉴를 등록해주세요</p>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default MenuIndex;
