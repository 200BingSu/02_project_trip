import {
  Button,
  Checkbox,
  CheckboxChangeEvent,
  Form,
  Input,
  message,
} from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import "../../../styles/antd-styles.css";

interface BusinessStatusResponse {
  request_cnt: number;
  match_cnt: number;
  status_code: string;
  data: {
    b_no: string;
    b_stt: string;
    b_stt_cd: string;
    tax_type: string;
    tax_type_cd: string;
  }[];
}

const plainOptions = [
  <Checkbox
    key="Apple"
    value="required-1"
    className="custom-checkbox w-full flex text-xs"
  >
    [필수] 서비스 이용약관
    <button type="button" className=" text-slate-400" value="required-1">
      보기
    </button>
  </Checkbox>,

  <Checkbox
    key="Pear"
    value="required-2"
    className="custom-checkbox w-full flex text-xs"
  >
    [필수] 개인정보 수집 및 이용 동의
    <button
      type="button"
      className="custom-checkbox text-slate-400"
      value="required-2"
    >
      보기
    </button>
  </Checkbox>,

  <Checkbox
    key="Orange"
    value="required-3"
    className="custom-checkbox w-full flex text-xs"
  >
    [필수] 위치서비스 이용 동의
    <button type="button" className=" text-slate-400" value="required-3">
      보기
    </button>
  </Checkbox>,
  <Checkbox key="Orange" value="option" className="custom-checkbox text-xs">
    [선택] 이벤트 및 할인 혜택 안내 동의
  </Checkbox>,
];

const SignUpBusiness = (): JSX.Element => {
  const [businessNum, setBusinessNum] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true); // ✅ 제출 버튼 비활성화 상태
  const [checkedList, setCheckedList] = useState<string[]>([]);

  const [form] = Form.useForm(); // ✅ Form 인스턴스 생성
  const navigate = useNavigate();

  const fetchBusinessStatus = async (
    businessNum: string,
  ): Promise<BusinessStatusResponse | null> => {
    const data = {
      b_no: [businessNum.replace(/-/g, "")], // "-" 제거 후 배열로 변환
    };

    try {
      console.log("🔍 요청 데이터:", data);
      const res = await axios.post<BusinessStatusResponse>(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${import.meta.env.VITE_BUSINESS_NUMBER}`,
        { b_no: [businessNum.replace(/-/g, "")] },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      console.log("✅ 응답 데이터:", res.data);

      const businessData = res.data?.data?.[0];

      if (businessData?.b_stt_cd === "01") {
        setIsDisabled(false);
        message.success("유효한 사업자 등록번호입니다.");
      } else {
        setIsDisabled(true);
        message.error("존재하지 않는 사업자입니다.");
      }
      return res.data;
    } catch (error) {
      console.log("✅ fetchBusinessStatus error:", error);
      message.error("조회 중 오류가 발생했습니다. 다시 시도해주세요.");
      setIsDisabled(true);
      return null;
    }
  };

  // plainOptions에서 value만 추출한 배열
  const plainOptionsValues = plainOptions.map(checkbox => checkbox.props.value);

  const checkAll = plainOptionsValues.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptionsValues.length;

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    // plainOptionsValues에서 값만 추출해서 체크박스의 value들을 처리
    setCheckedList(e.target.checked ? [...plainOptionsValues] : []);
  };

  // ✅ 입력값 변경 시, 모든 필수 필드가 입력되었는지 확인하여 버튼 활성화 여부 변경
  const handleValuesChange = () => {
    const values = form.getFieldsValue([
      "name",
      "phone",
      "email",
      "pw",
      "pwcheck",
    ]);

    // 모든 필수 필드가 채워졌는지 확인
    const allFieldsFilled = Object.values(values).every(
      value => typeof value === "string" && value.trim() !== "",
    );

    // 필수 체크박스가 모두 선택되었는지 확인
    const requiredCheckboxes = ["required-1", "required-2", "required-3"];

    const noErrors = form
      .getFieldsError()
      .every(({ errors }) => errors.length === 0);

    // 모든 조건이 만족되면 제출 버튼 활성화
    setIsSubmitDisabled(!(allFieldsFilled && requiredCheckboxes && noErrors));
  };

  // ✅ 체크박스 변경 핸들러 (필수 체크박스 체크 여부 확인)
  const onChange = (list: string[]) => {
    setCheckedList(list);
    handleValuesChange(); // 체크박스 변경 시에도 버튼 활성화 여부 확인
  };

  return (
    <div>
      <TitleHeaderTs
        title="회원가입"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <div className="my-6">
        <Form.Item
          label="사업자 등록번호"
          layout="vertical"
          className="custom-form-item !text-xs px-4"
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
            onClick={() => fetchBusinessStatus(businessNum)}
            className="text-base font-medium inline-block px-6 !h-auto"
          >
            조회
          </Button>
        </Form.Item>
        <Form
          layout="vertical"
          className="px-4"
          form={form} // ✅ Form 인스턴스 연결
          disabled={isDisabled}
          onValuesChange={handleValuesChange} // ✅ 값이 변경될 때 버튼 활성화 여부 체크
        >
          <Form.Item
            label="이름"
            name="name"
            className="cust om-form-input"
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
            name="email"
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
            name="pw"
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
            name="pwcheck"
            className="custom-form-input"
            dependencies={["pw"]}
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
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            className="custom-all-checkbox bg-slate-50 w-full font-medium text-base  py-5 px-3 rounded-lg mt-4 text-slate-700"
          >
            전체 동의합니다.
          </Checkbox>

          <Checkbox.Group
            value={checkedList}
            onChange={onChange}
            className="flex flex-col gap-2 w-full px-3 py-4"
          >
            {plainOptions}
          </Checkbox.Group>
          {/* 약관 보기 */}

          {/* 필수 약관을 모두 동의해야 제출 가능 메세지 */}

          {/* 제출 버튼 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              disabled={isSubmitDisabled}
              className="text-base py-3 !h-auto mb-12"
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
