import { Outlet, useNavigate } from "react-router-dom";

const Mypage = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>사장님 마이페이지</h1>
      <ul>
        <li>
          <button type="button" onClick={() => navigate("/business/register")}>
            업체등록
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigate("/business/store")}>
            가게
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigate("/business/menu")}>
            메뉴
          </button>
        </li>
        <li>
          <button
            type="button"
            onClick={() => navigate("/business/reservation")}
          >
            예약
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigate("/business/coupon")}>
            쿠폰
          </button>
        </li>
        <li>
          <button type="button" onClick={() => navigate("/business/review")}>
            리뷰
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Mypage;
