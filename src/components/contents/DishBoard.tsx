import { MenuType } from "../../types/interface";
import { MenuPic } from "../../constants/pic";

const DishBoard = ({
  strfId,
  menuData,
}: {
  strfId: number;
  menuData: MenuType[];
}) => {
  return (
    <div className="px-4 my-6">
      <h3 className="font-semibold text-slate-700 text-xl">대표메뉴</h3>
      <ul className="grid grid-cols-2 gap-3 mt-5">
        {menuData.map(item => (
          <li key={item.menuId}>
            <div className="w-full aspect-square rounded-2xl overflow-hidden">
              <img
                src={`${MenuPic}/${strfId}/menu/${item?.menuPic}`}
                alt={item?.menuTitle}
                className="w-full h-full object-cover "
              />
            </div>
            <div className="mt-2 text-slate-700">
              <p className="text-lg">{item.menuTitle}</p>
              <p className="text-base font-semibold tracking-tight">
                {item.menuPrice.toLocaleString()}원
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishBoard;
