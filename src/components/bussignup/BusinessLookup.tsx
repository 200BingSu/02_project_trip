import { Button, Form, Input, message } from "antd";
import axios from "axios";

interface BusinessLookupProps {
  businessNum: string;
  setBusinessNum: (value: string) => void;
  setIsDisabled: (value: boolean) => void;
}
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

const BusinessLookup = ({
  businessNum,
  setBusinessNum,
  setIsDisabled,
}: BusinessLookupProps): JSX.Element => {
  const fetchBusinessStatus = async (
    businessNum: string,
  ): Promise<BusinessStatusResponse | void> => {
    const data = { b_no: [businessNum.replace(/-/g, "")] };
    try {
      const res = await axios.post<BusinessStatusResponse>(
        `https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${import.meta.env.VITE_BUSINESS_NUMBER}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );

      const businessData = res.data?.data?.[0];

      if (businessData?.b_stt_cd === "01") {
        setIsDisabled(false);
        message.success("유효한 사업자 등록번호입니다.");
      } else {
        setIsDisabled(true);
        message.error("존재하지 않는 사업자입니다.");
      }
    } catch (error) {
      setIsDisabled(true);
      message.error("조회 중 오류가 발생했습니다.");
    }
  };
  return (
    <Form.Item
      label="사업자 등록번호"
      name="busiNum"
      rules={[{ required: true, message: "Please input!" }]}
      layout="vertical"
      className="custom-form-item !text-xs px-4"
    >
      <Input
        placeholder="사업자 번호 입력"
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
  );
};

export default BusinessLookup;
