import React from "react";
import TitleHeader from "../layout/header/TitleHeader";

const Policy = React.memo(({ policyType, setShowPolicy }) => {
  const makePolicy = () => {
    switch (policyType) {
      case "required-1":
        return (
          <div>
            <h1>이용 약관 및 동의</h1>

            <section>
              <h2>1. 만 14세 이상 동의 (필수)</h2>
              <p>
                <strong>관련 법률:</strong> 개인정보 보호법 제22조, 정보통신망법
                제50조
              </p>
              <p>
                <strong>필요한 이유:</strong> 만 14세 미만 아동의 경우 법정
                대리인의 동의가 필수이므로, 14세 이상임을 확인하는 조항이 필요.
              </p>
            </section>

            <section>
              <h2>2. 서비스 이용약관 (필수)</h2>
              <p>
                <strong>관련 법률:</strong> 전자상거래법, 정보통신망법,
                공정거래법
              </p>
              <p>
                <strong>참고 자료:</strong> 공정거래위원회 표준 약관 참고 (표준
                이용약관 검색)
              </p>
              <h3>구성 요소:</h3>
              <ul>
                <li>서비스의 목적</li>
                <li>회원가입 및 탈퇴</li>
                <li>이용자의 권리 및 의무</li>
                <li>서비스 제공 및 제한</li>
                <li>면책 조항</li>
              </ul>
            </section>

            <section>
              <h2>3. 개인정보 수집 및 이용 동의 (필수)</h2>
              <p>
                <strong>관련 법률:</strong> 개인정보 보호법 제15조, 제17조,
                제24조
              </p>
              <p>
                <strong>참고 자료:</strong> 개인정보보호위원회의 개인정보 처리
                지침 확인 (링크)
              </p>
              <h3>필수 포함 항목:</h3>
              <ul>
                <li>수집하는 개인정보 항목</li>
                <li>수집 목적</li>
                <li>보유 및 이용 기간</li>
                <li>제3자 제공 여부</li>
                <li>동의 거부 시 불이익</li>
              </ul>
            </section>

            <section>
              <h2>4. 위치서비스 이용 동의 (필수)</h2>
              <p>
                <strong>관련 법률:</strong> 위치정보의 보호 및 이용 등에 관한
                법률 (위치정보법)
              </p>
              <p>
                <strong>참고 자료:</strong> 방송통신위원회 및 KISA 참고
              </p>
              <h3>필수 포함 항목:</h3>
              <ul>
                <li>위치정보의 수집 목적</li>
                <li>제공 범위 및 공유 대상</li>
                <li>보유 기간 및 이용 방법</li>
                <li>동의 철회 및 삭제 방법</li>
              </ul>
            </section>

            <section>
              <h2>5. 이벤트 및 할인 혜택 안내 동의 (선택)</h2>
              <p>
                <strong>관련 법률:</strong> 정보통신망법 제50조, 개인정보 보호법
              </p>
              <p>
                <strong>참고 자료:</strong> 개인정보보호위원회 가이드라인
              </p>
              <h3>주의할 점:</h3>
              <ul>
                <li>광고성 정보 전송 동의 여부를 명확히 표시해야 함.</li>
                <li>수신 거부 방법을 포함해야 함.</li>
              </ul>
            </section>
          </div>
        );
      case "required-2":
        return <div>필수 약관 2</div>;
      case "required-3":
        return <div>필수 약관 3</div>;
      case "required-4":
        return <div>필수 약관 4</div>;
      default:
        return <div>약관 없음</div>;
    }
  };
  return (
    <div className="pt-[60px] max-w-3xl w-[768px] mx-auto h-screen fixed z-50 top-0 right-[50%] translate-x-[50%] bg-white">
      <TitleHeader
        icon={"close"}
        title={"약관"}
        onClick={() => {
          setShowPolicy(false);
        }}
      />
      <h1 className="text-[24px] font-bold text-center">약관 {policyType}</h1>
    </div>
  );
});

export default Policy;
