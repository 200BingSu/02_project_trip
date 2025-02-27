import { Button, Input, Space } from "antd";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";
import axios from "axios";
import { useEffect, useState } from "react";

const SignUpBusiness = (): JSX.Element => {
  const [businessNum, setBusinessNum] = useState("");

  const fetchBusinessStatus = async () => {
    const data = {
      b_no: businessNum.replace(/-/g, ""), // "-" 제거 후 배열로 변환
      start_dt: "20200420",
      p_nm: "백재상",
      p_nm2: "백재상",
      b_nm: "",
      corp_no: "",
      b_sector: "",
      b_type: "",
      b_adr: "",
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
      <TitleHeaderTs title="회원가입" icon="back" />
      <div>
        <Space direction="vertical" size="middle">
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="사업자 번호를 입력하세요"
              value={businessNum}
              onChange={e => setBusinessNum(e.target.value)}
            />
            <Button type="primary" onClick={fetchBusinessStatus}>
              Submit
            </Button>
          </Space.Compact>
        </Space>
      </div>
    </div>
  );
};
export default SignUpBusiness;
