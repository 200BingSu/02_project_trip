import { Button, InputNumber, Spin } from "antd";
import axios from "axios";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCookie } from "../../../utils/cookie";

const MakeQr = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // router
  const [searchPrams] = useSearchParams();
  const strfId = searchPrams.get("strfId");
  // useState
  const [isLoading, setIsLoading] = useState(false);
  const [qrData, setQrData] = useState();
  const [img, setImg] = useState("");
  const [amount, setAmount] = useState<number>();
  // API QR 제작
  const createQr = async (): Promise<ArrayBuffer | null> => {
    const url = "/api/point/QRcode";
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}?strf_id=${strfId}&amount=${amount}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          responseType: "blob",
        },
      });
      console.log("QR제작", res.data);
      const imgUrl = window.URL.createObjectURL(
        new Blob([res.data], { type: res.headers["content-type"] }),
      );
      setImg(imgUrl);
      return res.data;
    } catch (error) {
      console.log("QR제작", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <section className="flex items-center justify-center py-12 border-b border-slate-200">
        <Spin spinning={isLoading}>
          <div className="w-80 aspect-square bg-slate-200 rounded-lg">
            <img src={img} alt="" />
          </div>
        </Spin>
      </section>
      <section className="px-4 py-10 flex flex-col gap-4">
        <InputNumber
          suffix={<p className="text-base pr-4">원</p>}
          onChange={e => {
            if (typeof e === "number") setAmount(e);
          }}
          value={amount}
          className="w-full max-h-[50px] h-[16vw] pl-8"
          size="large"
          formatter={value => {
            if (typeof value === "string") {
              return (value as string).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
            return "";
          }}
          parser={value => value?.replace(/,/g, "") as unknown as number}
        />
        <Button
          type="primary"
          className="text-xl max-h-[50px] h-[16vw]"
          onClick={createQr}
        >
          발급
        </Button>
      </section>
    </div>
  );
};

export default MakeQr;
