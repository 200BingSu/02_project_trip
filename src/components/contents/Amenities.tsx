import { useEffect, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import jwtAxios from "../../apis/jwt";
import { Iamenity } from "../../types/interface";
import { matchAmenitiesIcon } from "../../utils/match";
import AmenityModal from "./AmenityModal";

const Amenities = ({ strfId }: { strfId: number }) => {
  const [amens, setAmens] = useState<Iamenity[]>();
  const [isMore, setIsMore] = useState(false);

  const getAmenities = async () => {
    try {
      const res = await jwtAxios.get(
        `/api/detail/amenity?strf_id=${strfId}&category=숙소`,
      );
      setAmens(res.data.data);
      console.log("편의시설 조회", res.data.data);
    } catch (error) {
      console.log("편의시설 조회", error);
    }
  };

  useEffect(() => {
    getAmenities();
  }, []);

  return (
    <div className="px-4 my-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700 text-xl">
          편의시설 및 서비스
        </h3>
        <button
          onClick={() => setIsMore(true)}
          className="flex items-center gap-[6px] text-sm text-slate-400"
        >
          더보기 <IoIosArrowRoundForward className="text-xl" />
        </button>
      </div>
      <ul className="grid grid-flow-col gap-4 overflow-hidden w-full h-[90px] mt-3">
        {amens?.map(amen => (
          <li
            key={amen.amenityId}
            className="min-w-14 flex flex-col items-center justify-center gap-[6px] text-slate-700"
          >
            <i className="text-2xl ">
              {matchAmenitiesIcon(amen.amenityId ?? 0)}
            </i>
            <p>{amen.amenityTitle}</p>
          </li>
        ))}
      </ul>

      {/* 편의 시설 모달창 */}
      {isMore ? (
        <AmenityModal
          handleCancel={() => setIsMore(!isMore)}
          amenities={amens}
        />
      ) : null}
    </div>
  );
};

export default Amenities;
