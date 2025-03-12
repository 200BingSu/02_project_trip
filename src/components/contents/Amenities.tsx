import { FaBed } from "react-icons/fa6";
import { IoIosArrowRoundForward } from "react-icons/io";

const Amenities = () => {
  return (
    <div>
      <div>
        <h3>편의시설 및 서비스</h3>
        <button>
          더보기 <IoIosArrowRoundForward />
        </button>
      </div>
      <ul>
        <li>
          <FaBed />
          <p>침대</p>
        </li>
      </ul>
    </div>
  );
};

export default Amenities;
