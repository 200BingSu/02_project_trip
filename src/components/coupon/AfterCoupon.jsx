import { BiSolidCoupon } from "react-icons/bi";

const AfterCoupon = () => {
  const getAfter = async () => {
    try {
      const res = await axios.get(``, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.log("✅  error:", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center my-28">
      <BiSolidCoupon className="text-slate-300 text-[100px]" />
      <p className="text-slate-400 text-[20px]">
        사용 / 만료 된 쿠폰이 없습니다
      </p>
    </div>
  );
};

export default AfterCoupon;
