import { BiTime } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";

const Parlor = () => {
  return (
    <div>
      <button>01.22(수)~01.23(목)</button>
      <button>성인 2</button>
      <div>
        <i>
          <img src="" alt="" />
        </i>
        <div>
          <h2>스탠다드</h2>
          <p>
            <BiTime />
            입실 15:00 - 퇴실 11:00
          </p>
          <p>
            <FiUsers />
            기준 2인 / 최대 4인
          </p>
          <div>
            <span>69,000원</span>
            <button>예약하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parlor;
