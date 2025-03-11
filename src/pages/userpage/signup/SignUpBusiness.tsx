import { Button, Form, message } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import BusinessLookup from "../../../components/bussignup/BusinessLookup";
import UserInfoForm from "../../../components/bussignup/UserInfoForm";
import TermsAgreement from "../../../components/bussignup/TermsAgreement";
import "../../../styles/antd-styles.css";
import axios from "axios";
import { IAPI } from "../../../types/interface";

interface BusinessSignupProps {
  email: string;
  pw: string;
  name: string;
  birth?: string | null;
  tell?: string;
  busiNum: string;
}

const SignUpBusiness = (): JSX.Element => {
  const [businessNum, setBusinessNum] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isRequiredChecked, setIsRequiredChecked] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const businessSigup = async (values: any): Promise<IAPI<number>> => {
    if (!isRequiredChecked) {
      message.error("필수 약관에 모두 동의해주세요.");
      return {
        code: "error",
        data: 0,
      };
    }

    try {
      const data: BusinessSignupProps = {
        email: values.email,
        pw: values.pw,
        name: values.name,
        tell: values.tell,
        birth: null,
        busiNum: values.busiNum || businessNum,
      };

      console.log(data);

      const formData = new FormData();
      formData.append(
        "p",
        new Blob([JSON.stringify(data)], { type: "application/json" }),
      );

      const res = await axios.post<IAPI<number>>(
        `/api/busi/sign-up`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // FormData의 내용 확인
      console.log("1. 원본 데이터:", data);

      if (res.data.data === 1) {
        navigate("/signup/complete", { replace: true });
      } else {
        message.error("회원가입에 실패했습니다");
      }

      return res.data;
    } catch (error) {
      console.log(error);
      message.error("회원가입에 실패했습니다");
      return {
        code: "error",
        data: 0,
      };
    }
  };

  return (
    <div>
      <div>
        <TitleHeaderTs
          title="회원가입"
          icon="back"
          onClick={() => navigate(-1)}
        />
        <BusinessLookup
          businessNum={businessNum}
          setBusinessNum={setBusinessNum}
          setIsDisabled={setIsDisabled}
        />
        <Form
          form={form}
          layout="vertical"
          disabled={isDisabled}
          className="px-4"
          onFinish={businessSigup}
          initialValues={{ email: email }}
        >
          <UserInfoForm handleValuesChange={() => {}} initialEmail={email} />
          <TermsAgreement
            checkedList={checkedList}
            setCheckedList={setCheckedList}
            setIsRequiredChecked={setIsRequiredChecked}
          />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={isDisabled || !isRequiredChecked}
              className="w-full text-base py-3 !h-auto mb-12"
            >
              다음
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignUpBusiness;
