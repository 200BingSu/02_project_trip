import { useEffect, useState } from "react";
import { BiSolidCoupon } from "react-icons/bi";
import jwtAxios from "../../apis/jwt";

const AfterCoupon = () => {
  const [isAfter, setIsAfter] = useState([]);

  const getAfter = async () => {
    try {
      const res = await jwtAxios.get(`/api/coupon/expired-coupons`);
      setIsAfter(res.data.data);
      console.log("✅  getAfter:", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    getAfter();
  }, []);
  return (
    <>
      {isAfter?.usedCoupons?.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-28">
          <BiSolidCoupon className="text-slate-300 text-[100px]" />
          <p className="text-slate-400 text-[20px]">
            사용 / 만료 된 쿠폰이 없습니다
          </p>
        </div>
      ) : (
        <div className="bg-slate-100 px-4 py-5">
          {isAfter?.usedCoupons?.map(item => (
            <div
              key={item.couponId}
              className=" flex justify-between w-full h-full overflow-hidden bg-white border-[1px] border-slate-200 rounded-lg mb-3"
            >
              <div className="px-4 py-6">
                <h2 className="text-2xl font-semibold text-slate-400 mb-2">
                  {item.discountPer}% 할인
                </h2>
                <p className="text-xl font-semibold text-slate-400 mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-slate-400">
                  기한 만료{" "}
                  <span className="text-slate-400">
                    ({item.expiredAt.split(" ")[0].replaceAll("-", ".")}
                    까지)
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AfterCoupon;
