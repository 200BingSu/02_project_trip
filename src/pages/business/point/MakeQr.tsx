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

  const [img, setImg] = useState("");
  const [amount, setAmount] = useState<number>();
  // API QR 제작
  // API QR 제작
  const createQr = async (): Promise<void> => {
    const url = "/api/point/QRcode";
    setIsLoading(true);

    try {
      const res = await axios.get(`${url}?strf_id=${strfId}&amount=${amount}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob",
      });

      if (res.data) {
        const imgUrl = URL.createObjectURL(res.data);
        setImg(imgUrl);
      }
    } catch (error) {
      console.log("QR제작 에러:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 flex flex-col items-center">
      {/* 소개 */}
      <section className="py-10 flex flex-col gap-2 items-center">
        <h2 className="text-2xl text-slate-700 font-semibold">
          결제를 위한 QR 코드
        </h2>
        <p className="text-slate-500">
          고객이 포인트로 체크인할 경우, 결제를 위해 발급되는 QR 코드입니다.
        </p>
      </section>
      {/* QR코드 */}
      <section className="shadow-sm shadow-slate-200 border border-slate-200 rounded-lg flex flex-col items-center gap-8 w-fit overflow-hidden">
        <div className="bg-primary2 h-12 w-full mb-5"></div>
        <div
          className={`aspect-square w-56 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden mb-5`}
        >
          {img ? (
            <img
              src={img}
              alt="QR 코드"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Spin spinning={isLoading} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-5 px-8 py-8 border-t border-slate-200">
          <InputNumber
            placeholder="결제 금액을 입력하세요."
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
            onPressEnter={createQr}
          />
          <Button
            type="primary"
            className="text-lg max-h-[50px] h-[16vw]"
            onClick={createQr}
          >
            발급
          </Button>
        </div>
      </section>
    </div>
  );
};

export default MakeQr;
