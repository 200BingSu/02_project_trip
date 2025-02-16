import { Button, Form, Input } from "antd";

const ChangePw = () => {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
  };
  return (
    <div>
      <h1>비밀번호 변경</h1>
      <Form form={form} requiredMark={false} onFinish={onFinish}>
        <Form.Item name="password" label="비밀번호">
          <Input.Password />
        </Form.Item>
        <Form.Item name="passwordCheck" label="비밀번호 확인">
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
