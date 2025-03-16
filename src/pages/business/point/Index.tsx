import { Popover, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiCoin } from "react-icons/bi";
import PointItem from "../../../components/business/point/PointItem";
import NoData from "../../../components/common/NoData";
import { IAPI, IPoint } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

interface PoinData {
  totalAmount: number;
  pointDetails: IPoint[];
}

const Index = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // useState
  const [pointData, setPointData] = useState<PoinData>({
    totalAmount: 0,
    pointDetails: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // API 포인트 조회
  const getPointList = async (): Promise<IAPI<PoinData> | null> => {
    const url = "/api/business/my-page/used-point";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<PoinData>>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      console.log("포인트 조회", resultData);
      setPointData(resultData.data);
      return resultData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("포인트 조회 오류", error.response?.data);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPointList();
    // setPointData(busiPointMock);
  }, []);

  return (
    <div>
      {/* 사용된 포인트 */}
      <section className="flex flex-col gap-2 px-4 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2 ">
          <h3 className="text-2xl font-semibold text-slate-700">
            사용된 포인트
          </h3>
          <Popover
            placement="left"
            content={
              "결제된 포인트의 합계입니다. (환불된 포인트는 집계되지 않습니다)"
            }
            trigger="hover"
          >
            <span>
              <AiOutlineQuestionCircle className="text-lg text-slate-300 cursor-help" />
            </span>
          </Popover>
        </div>
        <div>
          <p className="text-4xl text-primary">
            {pointData?.totalAmount.toLocaleString() ?? "0"}원
          </p>
        </div>
        <div>
          <p className="bg-slate-100 rounded-lg p-5 text-sm text-slate-500">
            포인트 결제가 잘 못 되었을 경우,
            <br /> 포인트 결제일부터{" "}
            <span className="text-primary">1일 이내</span> 환불, 변경
            가능합니다.
          </p>
        </div>
      </section>
      {/* 내역 */}
      <section className="px-4">
        <Spin spinning={isLoading}>
          <ul className="py-5">
            {!isLoading &&
              pointData?.pointDetails.length > 0 &&
              pointData?.pointDetails.map((item, index) => (
                <PointItem key={index} item={item} />
              ))}
            {!isLoading &&
              (pointData?.pointDetails.length === 0 ||
                !pointData?.pointDetails) && (
                <NoData
                  icon={<BiCoin />}
                  content="포인트 결제 내역이 없습니다"
                />
              )}
          </ul>
        </Spin>
      </section>
    </div>
  );
};

export default Index;
