import { useNavigate } from "react-router-dom";

const BusinessIndex = (): JSX.Element => {
  //useNavigate
  const navigate = useNavigate();
  return (
    <div>
      사장님 메인페이지
      <ul className="flex gap-4">
        <button type="button" onClick={() => navigate("/business/mypage")}>
          마이페이지
        </button>
      </ul>
    </div>
  );
};
export default BusinessIndex;
