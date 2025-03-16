import { Button, Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";
import CouponItem from "../../../components/business/coupon/CouponItem";
import StrfInfo from "../../../components/business/StrfInfo";
import { ICoupon } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import NoData from "../../../components/common/NoData";
import { BiSolidCoupon } from "react-icons/bi";

const CouponIndex = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  // 쿠키
  const accessToken = getCookie("accessToken");
  // navigate
  const navigate = useNavigate();

  const navigateToCreateCoupon = () => {
    navigate(`/business/coupon/create?strfId=${strfId}`);
  };
  //useState
  const [couponData, setCouponData] = useState<ICoupon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenCouponDetail, setIsOpenCouponDetail] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(0);

  // 쿠폰 자세히 보기 선택
  const handleClickCoupon = (index: number): void => {
    if (selectedCoupon === index) {
      setIsOpenCouponDetail(!isOpenCouponDetail);
    } else {
      setSelectedCoupon(index);
      setIsOpenCouponDetail(true);
    }
  };

  // API 사업자 쿠폰 조회
  const getCouponList = async (): Promise<ICoupon[] | null> => {
    const url = "/api/coupon/business/issuance";
    setIsLoading(true);
    try {
      const res = await axios.get<ICoupon[]>(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (Array.isArray(resultData)) {
        setCouponData(resultData);
      }
      if (res.data) {
        setIsLoading(false);
      }
      return resultData;
    } catch (error) {
      console.log(error);
      setCouponData([]);
      setIsLoading(false);
      return null;
    }
  };
  useEffect(() => {
    getCouponList();
  }, []);

  return (
    <div>
      <StrfInfo />
      <section className="px-4 py-3 flex flex-col gap-5">
        {/* 안내문 */}
        <div className="px-4 py-4 bg-[rgba(165,238,254,0.31)] rounded-lg">
          <p className="text-base font-semibold text-slate-700">
            쿠폰의 발급을 신청해보세요!
          </p>
          <p className="text-sm font-medium text-slate-500">
            신청이 승인되어을 때, 쿠폰을 발급 받을 수 있어요.
          </p>
        </div>
        {/* 쿠폰 발급 버튼 */}
        <div>
          <Button
            type="primary"
            className="w-full py-2 max-h-[60px] h-[13.33vw] text-xl font-medium"
            onClick={navigateToCreateCoupon}
          >
            <AiOutlinePlus />
            혜택 등록
          </Button>
        </div>
      </section>
      {/* 쿠폰 목록 */}
      <section className="px-4 py-3 flex flex-col gap-5">
        <Spin spinning={isLoading}>
          <ul className="flex flex-col gap-5">
            {isLoading && <></>}
            {!isLoading && couponData?.length === 0 && (
              <NoData
                icon={<BiSolidCoupon />}
                content="쿠폰 목록이 없습니다."
              />
            )}
            {!isLoading &&
              couponData?.map((item, index) => {
                return (
                  <li key={index}>
                    <CouponItem
                      strfId={strfId}
                      item={item}
                      selected={
                        selectedCoupon === index && isOpenCouponDetail
                          ? true
                          : false
                      }
                      onClick={() => handleClickCoupon(index)}
                    />
                  </li>
                );
              })}
          </ul>
        </Spin>
      </section>
    </div>
  );
};

export default CouponIndex;
