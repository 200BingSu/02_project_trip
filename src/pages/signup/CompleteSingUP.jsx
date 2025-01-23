import { useLocation, useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";

const CompleteSingUP = () => {
  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationData = location.state;
  console.log(locationData);

  const handleNavigateClose = () => {
    navigate(`/signin`);
  };

  return (
    <div>
      <TitleHeader
        icon="close"
        title="회원가입"
        onClick={handleNavigateClose}
      />
      <div>체크 아이콘</div>
      <div>
        <p>
          <span className="text-primary">
            {locationData ? locationData.name : "닉네임"}
          </span>
          님 환영합니다.
        </p>
        <p>회원가입이 완료되었습니다.</p>
      </div>
      <button type="button" onClick={() => handleNavigateClose()}>
        로그인 페이지로 이동
      </button>
    </div>
  );
};
export default CompleteSingUP;
