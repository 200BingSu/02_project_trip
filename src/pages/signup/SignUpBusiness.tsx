import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { useState } from "react";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";
import { useNavigate } from "react-router-dom";
import "../../styles/antd-styles.css";

const SignUpBusiness = (): JSX.Element => {
  const [businessNum, setBusinessNum] = useState("");

  const navigate = useNavigate();

  const fetchBusinessStatus = async () => {
    const data = {
      b_no: [businessNum.replace(/-/g, "")], // "-" 제거 후 배열로 변환
    };

    try {
      console.log("🔍 요청 데이터:", data);
      const res = await axios.post(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${import.meta.env.VITE_BUSINESS_NUMBER}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      console.log("✅ 응답 데이터:", res.data);
    } catch (error) {
      console.log("✅ fetchBusinessStatus error:", error);
    }
  };

  console.log(import.meta.env.VITE_BUSINESS_NUMBER);

  return (
    <div>
      <TitleHeaderTs
        title="회원가입"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <div className="my-6">
        <Form layout="vertical" className="px-4 ">
          <Form.Item
            label="사업자 등록번호"
            className="custom-form-item !text-xs"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input
              placeholder="사업자 번호를 입력하세요"
              value={businessNum}
              onChange={e => setBusinessNum(e.target.value)}
              className="py-[14px] px-3"
            />
            <Button
              type="primary"
              onClick={fetchBusinessStatus}
              className="text-base font-medium inline-block px-6 !h-auto"
            >
              조회
            </Button>
          </Form.Item>
          <Form.Item
            label="이름"
            name="Input"
            className="custom-form-input"
            rules={[
              { required: true, message: "Please input!", whitespace: true },
            ]}
          >
            <Input placeholder="이름을 입력하세요" className="py-[14px] px-3" />
          </Form.Item>
          <Form.Item
            label="전화번호"
            name="phone"
            className="custom-form-input"
            rules={[
              {
                pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                message: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)",
              },
            ]}
          >
            <Input
              placeholder="휴대폰 번호를 입력하세요"
              className="py-[14px] px-3"
            />
          </Form.Item>
          <Form.Item
            label="이메일"
            name="Input"
            className="custom-form-input"
            rules={[
              {
                required: true,
                message:
                  "이메일 형식에 맞지 않는 메일 주소입니다. 다시 입력해주세요.",
              },
              {
                required: true,
                message: "이메일은 필수 입력 항목입니다.",
              },
            ]}
          >
            <Input
              placeholder="이메일을 입력하세요"
              className="py-[14px] px-3"
            />
          </Form.Item>
          <Form.Item
            label="비밀번호"
            name="Input"
            className="custom-form-input"
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
              placeholder="비밀번호를 입력하세요"
              className="py-[14px] px-3"
            />
          </Form.Item>
          <Form.Item
            label="비밀번호 확인"
            name="Input"
            className="custom-form-input"
            dependencies={["password"]}
            rules={[
              { required: true, message: "비밀번호를 다시 확인해 주세요" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("pw") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "비밀번호가 일치하지 않습니다. 다시 입력해주세요.",
                    ),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="비밀번호 다시 입력하세요"
              className="py-[14px] px-3"
            />
          </Form.Item>
          {/* 약관 동의 */}
          <Checkbox className="bg-slate-100 w-full font-medium text-lg  py-5 px-3 rounded-lg my-4 text-slate-700  ">
            전체 동의합니다.
          </Checkbox>
          <Checkbox.Group className="flex flex-col gap-2 w-full">
            <div className="w-full flex justify-between">
              <Checkbox value="required-2" className="underline">
                [필수] 서비스 이용약관
              </Checkbox>
              <button
                type="button"
                className="text-xs text-slate-300"
                value="required-2"
              >
                보기
              </button>
            </div>
            <div className="w-full flex justify-between">
              <Checkbox value="required-3" className="underline">
                [필수] 개인정보 수집 및 이용 동의
              </Checkbox>
              <button
                type="button"
                className="text-xs text-slate-300"
                value="required-3"
              >
                보기
              </button>
            </div>
            <div className="w-full flex justify-between">
              <Checkbox value="required-4" className="underline">
                [필수] 위치서비스 이용 동의
              </Checkbox>
              <button
                type="button"
                className="text-xs text-slate-300"
                value="required-4"
              >
                보기
              </button>
            </div>
            <Checkbox value="option-1">
              [선택] 이벤트 및 할인 혜택 안내 동의
            </Checkbox>
          </Checkbox.Group>

          {/* 약관 보기 */}

          {/* 필수 약관을 모두 동의해야 제출 가능 메세지 */}

          {/* 제출 버튼 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="text-base py-3 !h-auto mt-4 mb-12"
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
