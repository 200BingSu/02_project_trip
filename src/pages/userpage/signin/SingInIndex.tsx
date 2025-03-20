import { Button, Checkbox, Form, Input, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import logo from "../../../assets/logo_1.png";
import { tsUserAtom } from "../../../atoms/tsuserAtom";
import { USER } from "../../../constants/api";
import "../../../styles/antd-styles.css";
import { ProviderType, ROLE } from "../../../types/enum";
import { Iuser } from "../../../types/interface";
import { getCookie, removeCookie, setCookie } from "../../../utils/cookie";

//interface
interface IPostLogin extends Iuser {
  code: string;
}
interface LoginFrom {
  email: string;
  pw: string;
}

//카카오 로그인 url
const host = window.location.origin;
const redirect_uri = `${host}/signup/kakao`;

// const dev = "http://localhost:8080";
const docker = "http://112.222.157.157:5231";
const postKakaoUrl = `${docker}/oauth2/authorization/kakao?redirect_uri=${redirect_uri}`;
const handleKakaoLogin = () => {
  window.location.href = `${postKakaoUrl}`;
};

const SingInIndex = () => {
  //쿠키
  const savedUserLogin = getCookie("user");
  // console.log("savedUserLogin", savedUserLogin);
  const nowEmail = savedUserLogin?.email;
  const [form] = Form.useForm();
  // recoil
  const [, setUserInfo] = useRecoilState(tsUserAtom);

  // useNavigate
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };
  const navigateToBusiness = () => {
    navigate("/business");
  };
  // useState
  const [loginType, setLoginType] = useState<"personal" | "business" | "guest">(
    "personal",
  );
  const [isSaveLogin, setIsSaveLogin] = useState(
    savedUserLogin ? savedUserLogin.isSaveLogin : false,
  );
  const [isSaveEmail, setIsSaveEmail] = useState(
    savedUserLogin ? savedUserLogin.isSaveEmail : false,
  );

  // 로그인 함수
  const postSignInUser = async (
    data: LoginFrom,
  ): Promise<IPostLogin | null> => {
    const url =
      loginType === "personal" ? USER.signInUser : USER.signInBusiness;
    try {
      const res = await axios.post<IPostLogin>(`${url}`, data);
      // console.log("로그인 시도:", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        // console.log("현재 시각:", moment().format("H:mm:ss"));
        setCookie(`accessToken`, res.data.accessToken);
        setCookie("user", {
          userId: res.data.userId,
          email: data.email,
          isSaveLogin: isSaveLogin,
          isSaveEmail: isSaveEmail,
          ProviderType: ProviderType.LOCAL,
          role: resultData.role,
          strfDtos: resultData.strfDtos,
        });
        setUserInfo({
          userId: resultData.userId,
          accessToken: resultData.accessToken,
          role: [...resultData.role],
          providerType: ProviderType.LOCAL,
          strfDtos: resultData.strfDtos,
        });
      }
      // console.log(resultData.role);
      // 사업자 탭 분리안되어 있어서 임시조치
      if (resultData.role.includes(ROLE.BUSI) === true) {
        navigateToBusiness();
      } else {
        // console.log(true);
        handleNavigateHome();
      }
      return resultData;
    } catch (error) {
      console.log("로그인 에러:", error);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.status);
        if (error.response?.status === 400) {
          message.error("계정을 찾을 수 없습니다");
        }
        if (error.response?.status === 401) {
          message.error("잘못된 비밀번호입니다");
        }
        if (error.response?.status === 403) {
          message.error("개인회원 계정입니다. 사업자 로그인을 부탁드립니다.");
        }
        if (error.response?.status === 405) {
          message.error(
            loginType === "personal"
              ? "사업자 계정입니다. 개인회원 로그인을 부탁드립니다."
              : "개인회원 계정입니다. 사업자 로그인을 부탁드립니다.",
          );
        }
      }
      removeCookie(`accessToken`);
      return null;
    }
  };

  // 폼 제출 함수
  const onFinish = (values: LoginFrom) => {
    // console.log("로그인 시도 데이터:", values);
    postSignInUser(values);
  };

  // 로그인 상태 저장
  const handleSaveLogin = () => {
    setIsSaveLogin(!isSaveLogin);
    if (isSaveLogin === true) {
      setIsSaveEmail(false);
    }
    if (isSaveLogin === false) {
      setIsSaveEmail(true);
    }
  };
  // 아이디 저장
  const handleSaveEmail = () => {
    setIsSaveEmail(!isSaveEmail);
  };
  useEffect(() => {
    const userInfo = getCookie("user");
    setCookie("user", { ...userInfo, isSaveLogin: false });
  }, [isSaveLogin]);
  useEffect(() => {
    const userInfo = getCookie("user");
    setCookie("user", { ...userInfo, isSaveEmail: false, email: "" });
  }, [isSaveEmail]);
  useEffect(() => {}, [loginType]);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
      {/* 로고 */}
      <div className="w-full flex items-center justify-center">
        <div
          className=" w-[44.2vw] max-w-[300px] h-auto "
          onClick={() => {
            navigate("/");
          }}
        >
          <img src={logo} alt="main_logo" className="cursor-pointer" />
        </div>
      </div>
      {/* 로그인 타입 */}
      <div className="w-full flex items-center justify-center gap-6">
        <div
          className={`text-base pb-2 ${loginType === "personal" ? "text-primary" : "text-slate-400"} 
          ${loginType === "personal" ? "border-b-[2px] border-primary" : "border-b-1 border-slate-200 hover:text-primary"}`}
          onClick={() => setLoginType("personal")}
        >
          개인회원
        </div>
        <div
          className={`text-base pb-2 ${loginType === "business" ? "text-primary" : "text-slate-400"}
          ${loginType === "business" ? "border-b-[2px] border-primary" : "border-b-1 border-slate-200 hover:text-primary"}`}
          onClick={() => setLoginType("business")}
        >
          기업회원
        </div>
      </div>

      <div className="w-full px-4">
        {/* {loginType === "personal" && ( */}
        <div>
          {/* 로그인 폼 */}
          <div className="w-full">
            <Form
              form={form}
              name="register"
              className="custom-form"
              onFinish={values => onFinish(values)}
              scrollToFirstError
            >
              {/* 이메일 */}
              <Form.Item
                name="email"
                label="이메일"
                labelCol={{ span: 24 }}
                initialValue={nowEmail || ""}
                className="custom-input-item"
                // rules={[{ required: true, message: "이메일을 입력해주세요." }]}
              >
                <Input
                  placeholder="이메일을 입력하세요"
                  style={{ height: "48px" }}
                />
              </Form.Item>
              <Form.Item
                name="pw"
                label="비밀번호"
                labelCol={{ span: 24 }} // Label의 그리드 크기
                className="custom-input-item"
                // rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
              >
                <Input.Password
                  placeholder="비밀번호를 입력하세요"
                  style={{ height: "48px" }}
                />
              </Form.Item>
              {/* 로그인 유지, 아이디 저장 */}
              <div className="w-full flex items-center justify-start">
                <Checkbox
                  checked={isSaveLogin}
                  onChange={handleSaveLogin}
                  className="text-slate-500 text-xs select-none"
                >
                  로그인 유지
                </Checkbox>
                <Checkbox
                  checked={isSaveEmail}
                  onChange={handleSaveEmail}
                  className="text-slate-500 text-xs select-none"
                >
                  아이디 저장
                </Checkbox>
              </div>
              {/* 제출 버튼 */}
              <Form.Item className="m-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="font-semibold text-base h-12 my-4"
                >
                  로그인
                </Button>
              </Form.Item>
            </Form>
            {/* 아이디 찾기, 비밀번호 찾기, 회원가입 */}
            <div className="w-full flex items-center justify-center gap-6">
              {/* <button
                type="button"
                className="text-slate-500 text-xs sm:text-sm "
              >
                아이디 찾기
              </button> */}
              {/* <span className="text-slate-200">|</span> */}
              <button
                type="button"
                className="text-slate-500 text-xs sm:text-sm "
                onClick={() => navigate(`/user/findpw`)}
              >
                비밀번호 찾기
              </button>
              <span className="text-slate-200">|</span>
              <Link
                to="/signup/index"
                className="text-slate-500 text-xs sm:text-sm "
              >
                회원가입
              </Link>
            </div>
          </div>
          {/* 카카오 로그인 */}
          <div
            className={`w-full ${loginType !== "business" ? "visible" : "invisible"}`}
          >
            <p className="text-slate-500 text-center text-sm relative my-4 before:absolute before:w-2/5 before:h-[1px] before:bg-slate-200 before:top-1/2 before:left-0 after:absolute after:w-2/5 after:h-[1px] after:bg-slate-200 after:top-1/2 after:right-0">
              또는
            </p>
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="w-full h-12 px-6 bg-[#FEE500] hover:bg-[#FEE500]/80 rounded-md flex items-center"
            >
              <img src="/images/kakaoIcon.svg" alt="kakao" />
              <p className="w-full text-center font-semibold text-base text-[#191600] ">
                카카오 로그인
              </p>
            </button>
          </div>
        </div>
        {/* )} */}
        {/* {loginType === "business" && <div>🔥 탭 2의 내용</div>} */}
      </div>
    </div>
  );
};
export default SingInIndex;
