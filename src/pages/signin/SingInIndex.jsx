import { Button, Form, Input } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { removeCookie, setCookie } from "../../utils/cookie";
import { userAtom } from "../../atoms/userAtom";
import { USER } from "../../constants/api";

// 폼 레이아웃
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const SingInIndex = () => {
  const [form] = Form.useForm();
  // recoil
  const [loginInfo, setLoginInfo] = useRecoilState(userAtom);

  // useNavigate
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(`/`);
  };
  // 로그인 함수
  const postSignInUser = async data => {
    try {
      const res = await axios.post(`${USER.signInUser}`, data);
      console.log("로그인 시도:", res.data);
      setCookie(`accessToken`, res.data.accessToken);
      setLoginInfo({
        userId: res.data.userId,
        accessToken: res.data.accessToken,
      });
      handleNavigateHome();
    } catch (error) {
      console.log("로그인 에러:", error);
      removeCookie(`accessToken`);
    }
  };

  // 폼 제출 함수
  const onFinish = values => {
    console.log("로그인 시도 데이터:", values);
    postSignInUser(values);
  };

  return (
    <div className="w-full px-[122px] py-[225px]">
      <div className="w-full flex items-center justify-center">
        <div className="w-[330px] h-[50px]">
          <img
            src="/public/images/logo_1.png"
            alt="로고 이미지"
            className="w-full h-full"
          />
        </div>
      </div>
      <div className="w-full flex gap-[30px] h-[30px] items-center justify-center">
        <button type="button" className="text-2xl">
          개인 회원
        </button>
        <button type="button" className="text-2xl">
          기업 회원
        </button>
      </div>
      {/* 로그인 폼 */}
      <div className="w-full ">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={values => onFinish(values)}
          style={{ maxWidth: 600 }}
          scrollToFirstError
        >
          {/* 이메일 */}
          <Form.Item
            name="email"
            label="이메일"
            labelCol={{ span: 24 }} // Label의 그리드 크기
            rules={[{ required: true, message: "이메일을 입력해주세요." }]}
          >
            <Input
              placeholder="이메일을 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>
          <Form.Item
            name="pw"
            label="비밀번호"
            labelCol={{ span: 24 }} // Label의 그리드 크기
            rules={[{ required: true, message: "비밀번호를 입력해주세요." }]}
          >
            <Input.Password
              placeholder="비밀번호를 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>

          {/* 제출 버튼 */}
          <Form.Item>
            <Button
              {...tailFormItemLayout}
              type="primary"
              htmlType="submit"
              block
              className="h-[60px]"
            >
              다음
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default SingInIndex;
