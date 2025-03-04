import axios from "axios";
import { getCookie, setCookie } from "../utils/cookie";

const jwtAxios = axios.create();
// 리퀘스트 이전
// 인증 토큰이 존재하는지 확인, 요청 헤더에 추가
const beforeReq = config => {
  // console.log("1. 요청 전에 먼저 전달", config);
  const accessToken = getCookie(`accessToken`);
  console.log("beforeReq", accessToken);
  if (!accessToken) {
    return Promise.reject({
      response: { data: { error: "accessToken이 없음" } },
    });
  }
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
};
// 리퀘스트 실패
const failReq = err => {
  console.log("failReq Err", err);
  return Promise.reject(err);
};
//리스폰스 이전
// 새로운 accessToken 갱신
const beforeRes = async res => {
  // console.log("2. 요청의 결과 전처리", res);
  const result = await axios.get(`/api/user/access-token`);
  setCookie(`accessToken`, result.data);
  return res;
};
// 리스폰스 실패
// accessToken 가져와서 갱신 후 오류 반환
const failRes = async err => {
  console.log(`failRes 에러`, err);
  const result = await axios.get(`/api/user/access-token`);
  setCookie(`accessToken`, result.data);
  return Promise.reject(err);
};

jwtAxios.interceptors.request.use(beforeReq, failReq);
jwtAxios.interceptors.response.use(beforeRes, failRes);

export default jwtAxios;
