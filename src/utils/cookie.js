import { Cookies } from "react-cookie";

const cookies = new Cookies();
// 쿠키에 저장하기
export const setCookie = (name, value, options) => {
  return cookies.set(name, value, { path: "/", ...options, sameSite: "lax" }); // 보안 문제로 sameSite 추가: 카카오 문제가 생길 경우 삭제
};
// 쿠키에 데이터 읽기
export const getCookie = name => {
  return cookies.get(name);
};
//  쿠키 삭제하기
export const removeCookie = name => {
  return cookies.remove(name, { path: "/" });
};
