import { IoIosClose } from "react-icons/io";
import { matchAmenitiesIcon } from "../../utils/match";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";

const AmenityModal = ({ handleCancel, amenities }) => {
  console.log(amenities);

  return (
    <div className="fixed top-0 left-1/2  -translate-x-1/2 z-[999] bg-white w-full max-w-[768px] h-screen">
      <div className="">
        <TitleHeaderTs
          icon="close"
          title="편의시설 및 서비스"
          onClick={handleCancel}
        />
      </div>
      <ul className="flex flex-wrap mt-6 px-4 gap-5">
        {amenities.map(item => (
          <li
            key={item.amenityId}
            className="min-w-14 flex flex-col items-center justify-center gap-[6px] text-slate-700"
          >
            <i className="text-2xl ">
              {matchAmenitiesIcon(item.amenityId ?? 0)}
            </i>
            <p>{item.amenityTitle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AmenityModal;
