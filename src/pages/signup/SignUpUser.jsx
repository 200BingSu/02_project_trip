import { Button, DatePicker, Divider, Form, Input, Select, Space } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER } from "../../constants/api";
import TitleHeader from "../../components/layout/header/TitleHeader";
import Policy from "../../components/signup/Policy";
import dayjs from "dayjs";

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

// 약관 동의
const CheckboxGroup = Checkbox.Group;

const defaultCheckedList = [];

const SignUpUser = () => {
  const [form] = Form.useForm();
  // useState
  const [formLayout, setFormLayout] = useState("vertical");
  const [formData, setFormData] = useState({});
  const [selectedValues, setSelectedValues] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [validateStatus, setValidateStatus] = useState(null); // validateStatus 상태
  const [policyType, setPolicyType] = useState("required");
  const [showPolicy, setShowPolicy] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  // useNavigate
  const navigate = useNavigate();
  const handleClickNavigate = data => {
    navigate(`/signup/confirmemail`, { state: data });
  };
  const navigateBack = () => {
    navigate(`/signin`);
  };
  // 약관
  const handleChange = useCallback(checkedValues => {
    setSelectedValues(checkedValues);
    setIsAllChecked(checkedValues.length > 4);
  }, []);

  const onCheckAllChange = useCallback(e => {
    const checked = e.target.checked;
    const newCheckedList = checked
      ? ["required-1", "required-2", "required-3", "required-4", "option-1"]
      : [];
    setSelectedValues(newCheckedList);
    setIsAllChecked(checked);
  }, []);

  // api 이메일 중복확인
  const getIdCheck = useCallback(async e => {
    console.log("아이디 중복 체크 시도");
    setValidateStatus("validating");
    try {
      const res = await axios.get(
        `${USER.checkDuplicatedEmail}${e.target.value}`,
      );
      if (res.data.data === true) {
        setValidateStatus("success");
      } else {
        setValidateStatus("error");
      }
      console.log("아이디 중복 체크", res.data);
    } catch (error) {
      console.log(error);
      setValidateStatus("error");
    }
  }, []);
  // post emailLink api
  const postEmail = useCallback(async data => {
    console.log("이메일 발송 데이터:", data);
    try {
      const res = await axios.get(`${USER.sendMail}${data.email}`, data);
      console.log("이메일 발송 결과:", res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onFinish = values => {
    const optionArr = selectedValues.filter(item => item === "option");
    const requiredArr = selectedValues.filter(item =>
      item.includes("required"),
    );
    const { confirm, ...filterData } = values;
    const email = values.email;
    const birthobj = values.birthday;
    const birthString = `${birthobj.year}-${birthobj.month > 9 ? birthobj.month : `0${birthobj.month}`}-${birthobj.day > 9 ? birthobj.day : `0${birthobj.day}`}`;
    const sendData = { ...filterData, birthday: birthString };
    console.log("폼 제출 데이터:", sendData);
    setFormData(sendData);

    // if (requiredArr.length === 4 && validateStatus === "success") {
    //   console.log("이메일 링크 요청", { email: email });
    //   postEmail({ email: email });
    //   handleClickNavigate(filterData);
    // } else {
    //   setErrorMessage(true);
    // }
  };

  // 약관 보기
  const handleClickPolicy = useCallback(e => {
    setPolicyType(e.target.value);
    setShowPolicy(true);
  }, []);

  // 년/월/일 선택을 위한 options 생성
  const yearOptions = Array.from({ length: 100 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: `${new Date().getFullYear() - i}년`,
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}월`,
  }));

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}일`,
  }));

  // Form의 초기값 설정
  useEffect(() => {
    form.setFieldsValue({
      birthday: {
        year: 1999,
        month: 1,
        day: 1,
      },
    });
  }, [form]);

  return (
    <>
      <TitleHeader icon={"back"} title={"회원가입"} onClick={navigateBack} />
      <div className="w-full">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={values => onFinish(values)}
          className="w-full px-4"
          layout={formLayout}
          scrollToFirstError
        >
          {/* 이름 */}
          <Form.Item
            name="name"
            label="이름"
            className="custom-form-item"
            rules={[
              {
                required: true,
                message: "이름은 필수 입력 항목입니다.",
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="이름을 입력하세요" style={{ height: "60px" }} />
          </Form.Item>
          {/* 이메일 */}
          <Form.Item
            name="email"
            label="이메일"
            className="custom-form-item"
            rules={[
              {
                type: "email",
                message:
                  "이메일 형식에 맞지 않는 메일 주소입니다. 다시 입력해주세요.",
              },
              {
                required: true,
                message: "이메일은 필수 입력 항목입니다.",
              },
            ]}
            hasFeedback
            validateStatus={validateStatus}
            help={
              validateStatus === "error"
                ? "이미 사용 중인 이메일입니다."
                : validateStatus === "success"
                  ? "사용 가능한 이메일입니다."
                  : null
            }
          >
            <Input
              onBlur={e => {
                if (e.target.value) {
                  getIdCheck(e);
                }
              }}
              placeholder="이메일을 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>

          {/* 비밀번호 */}
          <Form.Item
            name="pw"
            label="비밀번호"
            className="custom-form-item"
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
              style={{ height: "60px" }}
            />
          </Form.Item>
          {/* 비밀번호 확인 */}
          <Form.Item
            name="confirm"
            label="비밀번호 확인"
            className="custom-form-item"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "비밀번호 확인은 필수 입력 항목입니다.",
              },
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
              placeholder="비밀번호를 다시 한번 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>
          {/* 휴대폰 번호 */}
          {/* <Form.Item
            name="phone"
            label="휴대폰 번호"
            rules={[
              {
                pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                message:
                  "올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)",
              },
            ]}
            help="* 휴대폰 번호는 광고 또는 서비스 이용을 위한 항목입니다."
          >
            <Input
              placeholder="휴대폰 번호를 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item> */}
          {/* 생일 */}
          <Form.Item
            name="birthday"
            label="생일"
            className="custom-form-item"
            help="* 쿠폰 발급과 같은 서비스를 위한 항목입니다."
            style={{ paddingBottom: "20px" }}
          >
            <Space.Compact block>
              <Form.Item name={["birthday", "year"]} noStyle>
                <Select
                  placeholder="년도"
                  style={{ width: "33%", height: "60px" }}
                  options={yearOptions}
                />
              </Form.Item>
              <Form.Item name={["birthday", "month"]} noStyle>
                <Select
                  placeholder="월"
                  style={{ width: "33%", height: "60px" }}
                  options={monthOptions}
                />
              </Form.Item>
              <Form.Item name={["birthday", "day"]} noStyle>
                <Select
                  placeholder="일"
                  style={{ width: "34%", height: "60px" }}
                  options={dayOptions}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>

          {/* 약관 동의 */}
          <Checkbox
            onChange={onCheckAllChange}
            checked={isAllChecked}
            className="bg-slate-100 w-full font-medium text-lg  py-5 px-3 rounded-lg my-4 text-slate-700"
          >
            전체 동의합니다.
          </Checkbox>
          <Checkbox.Group
            value={selectedValues}
            onChange={handleChange}
            className="flex flex-col gap-2 w-full px-3"
          >
            <Checkbox value="required-1">[필수] 만 14세 이상입니다.</Checkbox>
            <div className="w-full flex justify-between">
              <Checkbox value="required-2" className="underline">
                [필수] 서비스 이용약관
              </Checkbox>
              <button
                type="button"
                className="text-xs text-slate-300"
                value="required-2"
                onClick={handleClickPolicy}
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
                onClick={handleClickPolicy}
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
                onClick={handleClickPolicy}
              >
                보기
              </button>
            </div>
            <Checkbox value="option-1">
              [선택] 이벤트 및 할인 혜택 안내 동의
            </Checkbox>
          </Checkbox.Group>
          {errorMessage ? (
            <p
              className={`${errorMessage ? "text-secondary3" : "text-white"} text-[14px] font-medium`}
            >
              * 필수 약관을 모두 동의해야 제출 가능합니다.
            </p>
          ) : null}
          {/* 약관 보기 */}
          {showPolicy ? (
            <Policy policyType={policyType} setShowPolicy={setShowPolicy} />
          ) : null}

          {/* 필수 약관을 모두 동의해야 제출 가능 메세지 */}

          {/* 제출 버튼 */}
          <Form.Item {...tailFormItemLayout}>
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
    </>
  );
};
export default SignUpUser;
