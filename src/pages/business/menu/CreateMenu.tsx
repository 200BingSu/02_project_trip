import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MenuForm from "../../../components/business/menu/MenuForm";
import RoomForm from "../../../components/business/menu/RoomForm";
import { CategoryType } from "../../../types/enum";
import { matchName } from "../../../utils/match";

const CreateMenu = () => {
  // 쿠키

  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const what = searchParams.get("what");

  // useState
  const [current, setCurrent] = useState<number>(0);
  const [menuId, setMenuId] = useState<string | null>(null);
  const hadleMenuId = (value: string | null) => {
    setMenuId(value);
  };
  const handleCurrent = (value: number | null) => {
    if (typeof value === "number") {
      setCurrent(value);
    }
  };
  useEffect(() => {
    if (what) {
      setCurrent(1);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="px-4 pt-3">
        <h2 className="text-2xl font-semibold text-slate-700">
          {matchName(category)}를 추가해주세요
          {what && ""}
          {!what && category === CategoryType.STAY && `${current + 1}/2`}
        </h2>
      </div>
      <section>
        {current === 0 && (
          <MenuForm handleCurrent={handleCurrent} hadleMenuId={hadleMenuId} />
        )}
        {current === 1 && <RoomForm menuId={menuId} />}
      </section>
    </div>
  );
};

export default CreateMenu;
