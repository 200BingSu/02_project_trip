import { Button, Divider, Form, Input } from "antd";
import Checkbox from "antd/es/checkbox/Checkbox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { USER } from "../../constants/api";
import TitleHeader from "../../components/layout/header/TitleHeader";
import Policy from "../../components/signup/Policy";

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

  // useNavigate
  const navigate = useNavigate();
  const handleClickNavigate = data => {
    navigate(`/signup/confirmemail`, { state: data });
  };
  // 약관
  const handleChange = checkedValues => {
    setSelectedValues(checkedValues);
    setIsAllChecked(checkedValues.length > 4);
  };

  const onCheckAllChange = e => {
    const checked = e.target.checked;
    const newCheckedList = checked
      ? ["required-1", "required-2", "required-3", "required-4", "option-1"]
      : [];
    setSelectedValues(newCheckedList);
    setIsAllChecked(checked);
  };

  //checkDuplicatedEmail
  const getIdCheck = async e => {
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
  };
  // post emailLink api
  const postEmail = async data => {
    console.log("이메일 발송 데이터:", data);
    try {
      const res = await axios.get(`${USER.sendMail}${data.email}`, data);
      console.log("이메일 발송 결과:", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onFinish = values => {
    const optionArr = selectedValues.filter(item => item === "option");
    const requiredArr = selectedValues.filter(item =>
      item.includes("required"),
    );
    const { confirm, ...filterData } = values;
    const email = values.email;
    setFormData(filterData);
    //console.log("보내지는 데이터:", postData);
    if (requiredArr.length === 4 && validateStatus === "success") {
      console.log("이메일 링크 요청", { email: email });
      postEmail({ email: email });
      handleClickNavigate(filterData);
    } else {
      console.log("제출 조건에 맞지 않음");
    }
  };

  // 약관 보기
  const handleClickPolicy = e => {
    setPolicyType(e.target.value);
    setShowPolicy(true);
  };

  return (
    <>
      <TitleHeader icon={"back"} title={"회원가입"} />
      <div className="w-full px-28 py-[50px] mt-[60px]">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={values => onFinish(values)}
          className="w-full"
          layout={formLayout}
          scrollToFirstError
        >
          {/* 이름 */}
          <Form.Item
            name="name"
            label="이름"
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
          >
            <Input
              onBlur={e => getIdCheck(e)}
              placeholder="이메일을 입력하세요"
              style={{ height: "60px" }}
            />
          </Form.Item>
          {/* 비밀번호 */}
          <Form.Item
            name="pw"
            label="비밀번호"
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
          {/* 약관 동의 */}
          {/* 약관 동의 */}
          <Checkbox
            onChange={onCheckAllChange}
            checked={isAllChecked}
            className="bg-slate-100 w-full font-semibold text-lg mb-[15px] py-[10px] px-[15px] rounded-lg"
          >
            전체 동의합니다.
          </Checkbox>
          <Checkbox.Group
            value={selectedValues}
            onChange={handleChange}
            className="flex flex-col gap-[10px] mb-[74px] w-full"
          >
            <Checkbox value="required-1">[필수] 만 14세 이상입니다.</Checkbox>
            <div className="w-full flex justify-between">
              <Checkbox value="required-2" className="underline">
                [필수] 서비스 이용약관
              </Checkbox>
              <button
                type="button"
                className="text-[16px] text-slate-300"
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
                className="text-[16px] text-slate-300"
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
                className="text-[16px] text-slate-300"
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
          {/* 약관 보기 */}
          {showPolicy ? (
            <Policy policyType={policyType} setShowPolicy={setShowPolicy} />
          ) : null}
          {/* 제출 버튼 */}
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" block className="h-[60px]">
              다음
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
export default SignUpUser;
