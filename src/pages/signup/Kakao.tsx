import { Spin } from "antd";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Kakao = (): JSX.Element => {
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const userName = searchParams.get("userName");
  const userEmail = searchParams.get("userEmail");
  const userProfileImage = searchParams.get("userProfileImage");

  //useState
  const [kakaoLogin] = useState<boolean>(false);
  // 카카오 로그인 정보 받은 뒤 회원가입 api
  return (
    <div>
      <Spin spinning={kakaoLogin} tip="카카오 로그인 진행 중..." size="large">
        {accessToken}
        {userName}
        {userEmail}
        {userProfileImage}
      </Spin>
    </div>
  );
};

export default Kakao;
