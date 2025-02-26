import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCookie } from "../../utils/cookie";
import { useRecoilState } from "recoil";
import { tsUserAtom } from "../../atoms/tsuserAtom";
// 주소: /signup/kakao
const Kakao = (): JSX.Element => {
  const navigate = useNavigate();
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");
  const userId = searchParams.get("user_id");
  const userEmail = searchParams.get("email");
  const userName = searchParams.get("nick_name");
  const pic = searchParams.get("pic");
  //recoil
  const [, setUserInfo] = useRecoilState(tsUserAtom);
  //useState
  const [kakaoLogin] = useState<boolean>(false);
  // 카카오 로그인 정보 받은 뒤 회원가입 api
  useEffect(() => {
    // 쿠키 저장
    if (accessToken) {
      setCookie(`accessToken`, accessToken);
    }
    if (userId && userEmail) {
      setCookie("user", {
        userId: userId,
        email: userEmail,
        isSaveLogin: true,
        isSaveEmail: true,
      });
    }
    if (userId && userEmail && userName && pic && accessToken) {
      setUserInfo({
        userId: Number(userId),
        name: userName,
        email: userEmail,
        porfilePic: pic,
        accessToken: accessToken,
      });
    }
    if (accessToken === null) {
      navigate("/signin");
    } else {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <Spin spinning={kakaoLogin} tip="카카오 로그인 진행 중..." size="large">
        <h1>카카오 로그인 준비 중(도흠쌤 버전 아님)</h1>
        <div className="flex flex-col gap-5">
          <p>토큰: {accessToken}</p>
          <p>userId: {userId}</p>
          <p>이메일: {userEmail}</p>
          <p>이름: {userName}</p>
          <p>이미지: {pic}</p>
        </div>
      </Spin>
    </div>
  );
};

export default Kakao;
