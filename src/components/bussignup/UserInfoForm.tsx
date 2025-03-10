import { Form, Input } from "antd";

interface UserInfoFormProps {
  handleValuesChange: (changedValues: any, allValues: any) => void;
  initialEmail?: string;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ initialEmail }) => {
  return (
    <>
      <Form.Item
        label="이름"
        name="name"
        rules={[{ required: true, message: "이름을 입력하세요" }]}
        className="cust om-form-input"
      >
        <Input placeholder="이름을 입력하세요" className="py-[14px] px-3" />
      </Form.Item>
      <Form.Item
        label="전화번호"
        name="tell"
        rules={[
          {
            pattern: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
            message: "올바른 전화번호 형식",
          },
        ]}
        className="custom-form-input"
      >
        <Input
          placeholder="휴대폰 번호를 입력하세요"
          className="py-[14px] px-3"
        />
      </Form.Item>
      <Form.Item
        label="이메일"
        name="email"
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
        className="custom-form-input"
        initialValue={initialEmail}
      >
        <Input
          placeholder="이메일을 입력하세요"
          className="py-[14px] px-3"
          disabled
        />
      </Form.Item>
      <Form.Item
        label="비밀번호"
        name="pw"
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
        className="custom-form-input"
      >
        <Input.Password
          placeholder="비밀번호를 입력하세요"
          className="py-[14px] px-3"
        />
      </Form.Item>
      <Form.Item
        label="비밀번호 확인"
        name="pwcheck"
        dependencies={["pw"]}
        rules={[
          ({ getFieldValue }) => ({
            validator(_, value) {
              return value === getFieldValue("pw")
                ? Promise.resolve()
                : Promise.reject("비밀번호 불일치");
            },
          }),
        ]}
        className="custom-form-input"
      >
        <Input.Password
          placeholder="비밀번호 다시 입력하세요"
          className="py-[14px] px-3"
        />
      </Form.Item>
    </>
  );
};

export default UserInfoForm;
