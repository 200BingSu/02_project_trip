import { Button, Form, Input } from "antd";
import jwtAxios from "../../apis/jwt";
import { useNavigate } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";

const ChangePw = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onFinish = values => {
    console.log(values);
    patchPw(values);
  };
  // api 비밀번호 변경
  const patchPw = async values => {
    const sendData = {
      pw: values.pw,
      newPw: values.newPw,
    };
    try {
      const res = await jwtAxios.patch(`/api/user/password`, sendData);
      console.log("비밀번호 변경", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        navigate("/signin");
      }
    } catch (error) {
      console.log("비밀번호 변경", error);
    }
  };
  return (
    <div>
      <TitleHeader
        title="비밀번호 변경"
        onClick={() => {
          navigate(-1);
        }}
        icon="back"
      />
      <div className="mt-[100px] flex flex-col justify-center items-start w-full px-8 gap-[20px]">
        <h2 className="text-[30px] text-slate-700 font-bold">비밀번호 변경</h2>
        <div className="w-full">
          <Form
            form={form}
            requiredMark={false}
            onFinish={onFinish}
            className="w-full"
          >
            <Form.Item
              name="pw"
              label="비밀번호"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "비밀번호는 필수 입력 항목입니다.",
                },
                {
                  pattern:
                    /^(?=.*[A-Za-z])(?=.*[\d~!@#$%^&*()_+=])[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/,
                  message:
                    "비밀번호는 반드시 8-20자 이내 숫자, 특수문자(), 영문자 중 2가지 이상을 조합하셔야 합니다",
                },
              ]}
            >
              <Input.Password
                placeholder="현재 비밀번호를 입력해주세요."
                style={{ height: "60px", width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              name="newPw"
              label="새 비밀번호"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: "새로운 비밀번호를 입력해주세요.",
                },
                {
                  pattern:
                    /^(?=.*[A-Za-z])(?=.*[\d~!@#$%^&*()_+=])[A-Za-z\d~!@#$%^&*()_+=]{8,20}$/,
                  message:
                    "비밀번호는 반드시 8-20자 이내 숫자, 특수문자(), 영문자 중 2가지 이상을 조합하셔야 합니다",
                },
              ]}
            >
              <Input.Password
                placeholder="새로운 비밀번호를 입력해주세요."
                style={{ height: "60px", width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="h-[60px] w-full text-[20px] font-semibold"
              >
                비밀번호 변경
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePw;
