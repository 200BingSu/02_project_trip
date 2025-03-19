import { Button, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import MenuItem from "../../../components/business/menu/MenuItem";
import NoData from "../../../components/common/NoData";
import { MenuType } from "../../../types/interface";
import { matchMenuIcon } from "../../../utils/match";

export interface IGetMenuListRes {
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // API 메뉴 목록
  const getMenuList = async (): Promise<IGetMenuListRes | null> => {
    const url = "/api/detail/menu";
    setIsLoading(true);
    try {
      const res = await axios.get<IGetMenuListRes>(`${url}?strf_id=${strfId}`);
      const resultData = res.data;
      if (resultData.data[0] !== null) {
        setMenuList(resultData.data);
      }
      setIsLoading(false);
      return resultData;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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
        <Spin spinning={isLoading}>
          {isLoading && <div className="h-96"></div>}
          <div className="flex flex-col gap-3">
            {!isLoading &&
              menuList.length > 0 &&
              menuList?.map((item, index) => (
                <MenuItem
                  item={item}
                  key={index}
                  strfId={strfId}
                  category={category as string}
                  getMenuList={getMenuList}
                />
              ))}
            {!isLoading && menuList.length === 0 && (
              <NoData
                icon={matchMenuIcon(category as string)}
                content="등록된 메뉴가 없습니다"
              />
            )}
          </div>
        </Spin>
      </section>
    </div>
  );
};

export default MenuIndex;
