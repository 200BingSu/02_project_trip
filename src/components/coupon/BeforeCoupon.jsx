import axios from "axios";
import { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookie";

const BeforeCoupon = () => {
  const [isBefore, setIsBefore] = useState([]);
  const accessToken = getCookie("accessToken");

  const getBefore = async () => {
    try {
      const res = await axios.get(`/api/coupon/available-coupons`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsBefore(res.data.data);
      console.log("✅  res.data.data:", res.data.data);
    } catch (error) {
      console.log("✅  error:", error);
    }
  };

  useEffect(() => {
    getBefore();
  }, []);

  return (
    <div className="mt-6">
      {isBefore?.coupons?.map(item => (
        <div
          key={item.couponId}
          className=" flex justify-between w-full h-full overflow-hidden bg-white rounded-lg mb-8 shadow-md "
        >
          <div className="px-8 py-10">
            <p className="text-xl text-primary mb-3">{item.title}</p>
            <h2 className="work text-3xl font-semibold text-slate-700 mb-8">
              {item.discountPer}% <span className="pre text-2xl">할인</span>
            </h2>
            <p className="work text-xl text-slate-500">
              {item.distributeAt.split("T")[0].replaceAll("-", ".")} ~
              {item.expiredAt.split("T")[0].replaceAll("-", ".")}
            </p>
          </div>
          <div className="relative w-52 bg-primary border-l-4 border-dashed border-slate-100 before:absolute before:w-10 before:h-10 before:bg-slate-100 before:rounded-full before:-top-4 before:-left-[22px]"></div>
        </div>
      ))}
    </div>
  );
};

export default BeforeCoupon;
