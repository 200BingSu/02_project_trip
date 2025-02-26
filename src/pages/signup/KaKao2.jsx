import React, { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
// 주소: /fe/redirect
const KaKao2 = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useRecoilState(userAtom);

  useEffect(() => {
    const myUrl = new URL(window.location.href);
    const error = myUrl.searchParams.get("error");
    if (error !== null) {
      alert("에러가 발생하였습니다.");
      console.log(error);
    }
    const accessToken = myUrl.searchParams.get("access_token");
    console.log(`accessToken: ${accessToken}`);
    // if (accessToken === null) {
    //   navigate("/signin");
    //   return;
    // }
    const userId = myUrl.searchParams.get("user_id");
    const nickName = myUrl.searchParams.get("nick_name");
    const pic = myUrl.searchParams.get("pic");

    //로그인 처리 후 화면이동
    localStorage.setItem("accessToken", accessToken);
    setUserInfo({ isLogin: true, userId, nickName, pic });
    // navigate("/");
  }, []);

  return (
    <div className="flexContainer h-full">
      <div className="notice item_container">
        <p>로그인 중입니다.(도흠쌤 버전)</p>
        <p>잠시만 기다려주세요.</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default KaKao2;
