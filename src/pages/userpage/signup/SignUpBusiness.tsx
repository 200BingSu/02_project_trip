import { Button, Form, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import BusinessLookup from "../../../components/bussignup/BusinessLookup";
import UserInfoForm from "../../../components/bussignup/UserInfoForm";
import TermsAgreement from "../../../components/bussignup/TermsAgreement";
import "../../../styles/antd-styles.css";
import axios from "axios";

interface BusinessSignupProps {
  profilePic?: string;
  p: {
    email: string;
    pw: string;
    name: string;
    birth?: string;
    tell?: string;
    busiNum: string;
  };
}

interface EmailCheckRes {
  code: string;
  data: boolean;
}

const SignUpBusiness = (): JSX.Element => {
  const [businessNum, setBusinessNum] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [isRequiredChecked, setIsRequiredChecked] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const businessSigup = async (values: any): Promise<void> => {
    if (!isRequiredChecked) {
      message.error("필수 약관에 모두 동의해주세요.");
      return;
    }

    try {
      const data: BusinessSignupProps = {
        p: {
          email: values.email,
          pw: values.pw,
          name: values.name,
          tell: values.tell,
          busiNum: values.busiNum,
        },
      };

      const formData = new FormData();
      formData.append(
        "p",
        new Blob([JSON.stringify(data)], { type: "application/json" }),
      );

      const res = await axios.post(`/api/sign-up`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // FormData의 내용 확인
      console.log("1. 원본 데이터:", data);

      // FormData 내용 확인
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log("3. 서버 응답:", res.data);

      navigate("/complete", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const getEmailCheck = async (email: string): Promise<boolean> => {
    try {
      const res = await axios.get<EmailCheckRes>(
        `/api/user/sign-up?email=${email}`,
      );

      if (res.data.data === true) {
        message.success("사용 가능한 이메일입니다");
      } else {
        message.error("이미 사용중인 이메일입니다");
      }
      return res.data.data;
    } catch (error) {
      console.log(error);
      message.error("이메일 중복 확인 중 오류가 발생했습니다");
      return false;
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
        >
          <UserInfoForm
            handleValuesChange={() => {}}
            getEmailCheck={getEmailCheck}
          />
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
