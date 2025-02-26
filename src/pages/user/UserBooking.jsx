import { useCallback, useEffect, useState } from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { userAtom } from "../../atoms/userAtom";
import Loading from "../../components/loading/Loading";
import { useRecoilValue } from "recoil";
import { LiaComment } from "react-icons/lia";
import Footer from "../Footer";
import Bookings from "../../components/user/Bookings";
const categoryArr = ["예약 목록", "예약 완료 내역"];
const UserBooking = () => {
  //recoil
  const { userId } = useRecoilValue(userAtom);
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  //useState
  const [category, setCategory] = useState(0);
  const [beforeList, setBeforeList] = useState([]);
  const [afterList, setAfterList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 예약 목록 불러오기
  const getBookingList = useCallback(async () => {
    try {
      const res = await jwtAxios.get(`/api/booking`);
      console.log("예약 목록", res.data);
      const resultData = res.data;
      setBeforeList(resultData.data.beforeList);
      setAfterList(resultData.data.afterList);
      if (res.data) {
        setIsLoading(true);
      }
    } catch (error) {
      console.log("예약 목록 불러오기 실패", error);
    }
  }, []);

  useEffect(() => {
    getBookingList();
  }, []);

  return (
    <div
      className="flex flex-col gap-[30px]
                "
    >
      {isLoading ? (
        <>
          <TitleHeader icon="back" title="내 예약" onClick={navigateBack} />
          <div className="flex flex-col gap-[20px] px-[32px] w-full">
            {/* 카테고리 버튼 */}
            <ul className="flex gap-[10px] w-full">
              {categoryArr.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => setCategory(index)}
                    className={`w-full flex justify-center items-center 
                  pt-[17px] pb-[16px]
                  text-[16px] 
                  ${index === category ? "border-b-[2px] border-primary text-primary" : "border-b-[1px] border-slate-200 text-slate-500"}`}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
            {/* 내용 */}
            <div className="min-h-[500px] flex flex-col justify-center items-center">
              {category === 0 ? (
                beforeList.length > 0 ? (
                  <div>
                    {beforeList.map((item, index) => {
                      return <Bookings key={index} />;
                    })}
                  </div>
                ) : (
                  <>
                    <i className="text-slate-300 text-[100px]">
                      <LiaComment />
                    </i>
                    <p className="text-slate-400 text-[20px]">
                      예약 내역이 없습니다.
                    </p>
                  </>
                )
              ) : null}
              {category === 1 ? (
                afterList.length > 0 ? (
                  <div>
                    {afterList.map((item, index) => {
                      return <Bookings key={index} />;
                    })}
                  </div>
                ) : (
                  <div>
                    <i className="text-slate-300 text-[100px]">
                      <LiaComment />
                    </i>
                    <p className="text-slate-400 text-[20px]">
                      예약 내역이 없습니다.
                    </p>
                  </div>
                )
              ) : null}
            </div>

            {/* 푸터 */}
            <Footer />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};
export default UserBooking;
