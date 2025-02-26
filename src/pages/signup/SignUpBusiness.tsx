import { Button, Input, Space } from "antd";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";

const SignUpBusiness = (): JSX.Element => {
  return (
    <div>
      <TitleHeaderTs title="회원가입" icon="back" />
      <div>
        <Space direction="vertical" size="middle">
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="사업자 번호를 입력하세요" />
            <Button type="primary">Submit</Button>
          </Space.Compact>
        </Space>
      </div>
    </div>
  );
};
export default SignUpBusiness;
