import { Button, Form, Input } from "antd";
import jwtAxios from "../../apis/jwt";

const ChangePw = () => {
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
    } catch (error) {
      console.log("비밀번호 변경", error);
    }
  };
  return (
    <div>
      <h1>비밀번호 변경</h1>
      <Form form={form} requiredMark={false} onFinish={onFinish}>
        <Form.Item name="pw" label="비밀번호">
          <Input.Password />
        </Form.Item>
        <Form.Item name="newPw" label="새 비밀번호">
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            비밀번호 변경
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePw;
