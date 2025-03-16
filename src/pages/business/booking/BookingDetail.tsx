import { Button, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CenterModalTs from "../../../components/common/CenterModalTs";
import { getCookie } from "../../../utils/cookie";
import axios from "axios";

interface IBookingDetail {
  menuTitle: string;
  roomNum: number;
  checkIn: string;
  checkOut: string;
  bookingNum: number;
  name: string;
  tell: string;
  email: string;
  finalPayment: number;
  couponTitle: string;
  recomCapacity: number;
  maxCapacity: number;
  extraPersonCount: number;
  extraFee: number;
}

const BookingDetail = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const state = searchParams.get("state");
  console.log("예약 상세 조회 예약 번호", bookingId);
  // useState
  const [bookingDetail, setBookingDetail] = useState<IBookingDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOkModalOpen, setIsOkModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  // API 예약 상세
  const getBookingDetail = async () => {
    const url = "/api/business/my-page/booking/details";
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}?bookingId=${bookingId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      if (resultData) {
        setBookingDetail(resultData);
      }
      setIsLoading(false);
      console.log("예약 상세 조회 결과", resultData);
    } catch (error) {
      console.log("예약 상세 조회 에러", error);
      setIsLoading(false);
    }
  };
  const matchBusiBookingButton = (state: string) => {
    switch (state) {
      case "0":
      case "1":
        return (
          <>
            <Button
              color="primary"
              variant="filled"
              className="w-full h-auto py-3 rounded-lg text-base font-semibold text-primary3 "
              onClick={() => setIsCancelModalOpen(true)}
            >
              예약 취소
            </Button>
            <Button
              type="primary"
              className="w-full h-auto py-3 rounded-lg text-base font-semibold "
              onClick={() => setIsOkModalOpen(true)}
            >
              예약 승인
            </Button>
          </>
        );
      case "2":
        return (
          <>
            <Button
              className="w-full h-auto py-3 rounded-lg text-base font-semibold bg-primary2 text-slate-700"
              onClick={() => setIsCancelModalOpen(true)}
            >
              예약 취소
            </Button>
          </>
        );
      case "3":
        return (
          <>
            <Button
              className="w-full h-auto py-3 rounded-lg text-base font-semibold text-slate-700"
              disabled
            >
              예약 취소 완료
            </Button>
          </>
        );
    }
  };

  useEffect(() => {
    getBookingDetail();
    // setBookingDetail(bookingDetailMock);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <Spin spinning={isLoading}>
        {/* 예약 내용 */}
        <section className="flex flex-col gap-3 px-4 py-3">
          <h3 className="text-xl font-semibold text-slate-600">예약 내용</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                객실
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.menuTitle} / {bookingDetail?.roomNum}호
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                예약일자
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {dayjs(bookingDetail?.checkIn).format("YYYY.MM.DD")} ~{" "}
                {dayjs(bookingDetail?.checkOut).format("YYYY.MM.DD")}(
                {dayjs(bookingDetail?.checkOut).diff(
                  dayjs(bookingDetail?.checkIn),
                  "day",
                )}
                박{" "}
                {dayjs(bookingDetail?.checkOut).diff(
                  dayjs(bookingDetail?.checkIn),
                  "day",
                ) + 1}
                일)
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                인원수
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.recomCapacity}명
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                추가인원
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.extraPersonCount}명
              </p>
            </div>
          </div>
        </section>
        <div className="h-[10px] bg-slate-100"></div>
        {/* 예약자 정보 */}
        <section className="flex flex-col gap-3 px-4 py-3">
          <h3 className="text-xl font-semibold text-slate-600">예약자 정보</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                예약자명
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.name}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                연락처
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.tell}
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                이메일
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.email}
              </p>
            </div>
          </div>
        </section>
        <div className="h-[10px] bg-slate-100"></div>
        {/* 결제 정보 */}
        <section className="flex flex-col gap-3 px-4 py-3">
          <h3 className="text-xl font-semibold text-slate-600">결제 정보</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                추가금액
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.extraFee.toLocaleString()}원
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                결제 예정 금액
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.finalPayment.toLocaleString()}원
              </p>
            </div>
            <div className="grid grid-cols-4">
              <p className="col-span-1 text-slate-600 text-lg font-semibold">
                사용 쿠폰
              </p>
              <p className="col-span-3 text-slate-500 text-base">
                {bookingDetail?.couponTitle}
              </p>
            </div>
          </div>
        </section>
      </Spin>
      <div className="h-[10px] bg-slate-100"></div>
      {/* 버튼 */}
      <section className="flex gap-3">
        {matchBusiBookingButton(state as string)}
      </section>
      {/* 모달 */}
      {isOkModalOpen && (
        <CenterModalTs
          title="예약 승인"
          content="해당 예약을 승인하시겠습니까?"
          handleClickSubmit={() => {}}
          handleClickCancle={() => setIsOkModalOpen(false)}
        />
      )}
      {isCancelModalOpen && (
        <CenterModalTs
          title="예약 취소"
          content="해당 예약을 취소하시겠습니까?"
          handleClickSubmit={() => {}}
          handleClickCancle={() => setIsCancelModalOpen(false)}
        />
      )}
    </div>
  );
};

export default BookingDetail;
