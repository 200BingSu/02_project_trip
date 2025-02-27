import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";
import { Button, Form, Input } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/antd-styles.css";

interface CERTProps {
  email: string;
  code: string;
}

const Authentication = (): JSX.Element => {
  const [isEmail, setIsEmail] = useState("");
  const [certCode, setCertCode] = useState("");
  const navigate = useNavigate();

  const getEmailCode = async (): Promise<string | null> => {
    try {
      const res = await axios.get<string | null>(`/api/mail?email=${isEmail}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("error :", error);
      return null;
    }
  };

  const postCERT = async ({
    email,
    code,
  }: CERTProps): Promise<CERTProps | null> => {
    try {
      const res = await axios.post<CERTProps>(`/api/mail`, {
        email,
        code,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    getEmailCode();
  }, []);

  const onSubmit = async () => {
    const result = await postCERT({
      email: isEmail,
      code: certCode,
    });

    if (result) {
      // 인증 성공 시 처리
      console.log("인증 성공");
    }
  };

  return (
    <div>
      <TitleHeaderTs
        title="이메일 인증"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <Form
        initialValues={{ remember: true }}
        autoComplete="off"
        className="mt-6 px-4"
        onFinish={onSubmit} // Form 제출 핸들러 추가
      >
        <Form.Item
          label="이메일"
          className="custom-form-item !text-xs"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Input
            placeholder="이메일을 입력하세요"
            className="py-[14px] px-3"
            value={isEmail}
            onChange={e => setIsEmail(e.target.value)}
          />
          <Button
            type="primary"
            className="text-xs font-medium inline-block px-4 !h-auto"
            onClick={getEmailCode}
            disabled={!isEmail}
          >
            인증코드 받기
          </Button>
        </Form.Item>

        <Form.Item
          label="인증코드"
          rules={[{ required: true, message: "인증 코드를 다시 입력해주세요" }]}
          className="custom-form-item !text-xs mt-3"
        >
          <Input
            className="py-[14px] px-3"
            value={certCode}
            onChange={e => setCertCode(e.target.value)}
          />
        </Form.Item>
        <p className="text-xs text-slate-400">
          메일을 받지 못했다면 인증 코드 재전송을 요청하거나 스팸 메일함을
          확인해 보세요. 이메일이 오지 않았나요?{" "}
          <span className="text-slate-600 underline cursor-pointer">
            이메일 재발송
          </span>
        </p>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="text-base py-3 !h-auto w-full mt-6"
            disabled={!isEmail || !certCode}
          >
            이메일 인증
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Authentication;
