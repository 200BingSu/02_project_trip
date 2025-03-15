import { MenuPic } from "../../constants/pic";
import { MenuType } from "../../types/interface";

const EntryTicket = ({
  strfId,
  menuData,
}: {
  strfId: number;
  menuData: MenuType[];
}) => {
  return (
    <div className="px-4 my-6">
      <h3 className="font-semibold text-slate-700 text-xl">입장권</h3>
      <ul>
        {menuData.map(item => (
          <li
            key={item.menuId}
            className="flex items-center justify-between gap-4 py-4 border-b border-slate-200 last:border-b-0"
          >
            <div className="text-slate-700">
              <h3 className="text-lg">{item.menuTitle}</h3>
              <p className="text-base font-semibold">
                {item.menuPrice.toLocaleString()}원
              </p>
            </div>
            <div className="w-24 aspect-square overflow-hidden rounded-2xl">
              <img
                src={`${MenuPic}/${strfId}/menu/${item?.menuPic}`}
                alt={item?.menuTitle}
                className="w-full h-full object-cover "
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryTicket;
