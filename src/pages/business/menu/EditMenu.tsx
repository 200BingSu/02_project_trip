import { useSearchParams } from "react-router-dom";
import MenuForm from "../../../components/business/menu/MenuForm";
import RoomForm from "../../../components/business/menu/RoomForm";
import { matchName } from "../../../utils/match";

const EditMenu = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  // const strfId = searchParams.get("strfId");
  const category = searchParams.get("category");
  const menuId = searchParams.get("menuId");
  const what = searchParams.get("what");
  // useState

  return (
    <div className="flex flex-col gap-2">
      <div className="px-4 pt-3">
        <h2 className="text-2xl font-semibold text-slate-700">
          {matchName(category)} 수정
        </h2>
      </div>
      <section>
        {what === "menu" && <MenuForm />}
        {what === "room" && <RoomForm menuId={menuId} />}
      </section>
    </div>
  );
};

export default EditMenu;
