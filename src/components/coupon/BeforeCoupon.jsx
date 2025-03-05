import { useEffect, useState } from "react";
import jwtAxios from "../../apis/jwt";
import { getCookie } from "../../utils/cookie";

const BeforeCoupon = () => {
  const [isBefore, setIsBefore] = useState([]);

  const accessToken = getCookie("accessToken");

  const getBefore = async () => {
    try {
      const res = await jwtAxios.get(`/api/coupon/available-coupons`);
      setIsBefore(res.data.data);
      console.log("✅  getBefore:", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    getBefore();
  }, []);

  return (
    <>
      {isBefore?.coupons?.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-28">
          <BiSolidCoupon className="text-slate-300 text-[100px]" />
          <p className="text-slate-400 text-[20px]">
            사용 / 만료 된 쿠폰이 없습니다
          </p>
        </div>
      ) : (
        <div className="bg-slate-100 px-4 py-5">
          {isBefore?.coupons?.map(item => (
            <div
              key={item.couponId}
              className=" flex justify-between w-full h-full overflow-hidden bg-white border-[1px] border-slate-200 rounded-lg mb-3"
            >
              <div className="px-4 py-6">
                <h2 className="text-2xl font-semibold text-primary mb-2">
                  {item.discountPer}% 할인
                </h2>
                <p className="text-xl font-semibold text-slate-700 mb-1">
                  {item.title}
                </p>
                <p className="text-sm text-slate-700">
                  {item.daysLeft}일 뒤 만료{" "}
                  <span className="text-slate-400">
                    (
                    {item.expiredAt.split(" ")[0].replaceAll("-", ".") +
                      " " +
                      item.expiredAt.split(" ")[1].slice(0, 5)}
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

export default BeforeCoupon;
