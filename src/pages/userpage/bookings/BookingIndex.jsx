import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import axios from "axios";
import { USER } from "../../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import SelectCoupon from "../../../components/booking/SelectCoupon";
import { IoIosArrowDown } from "react-icons/io";
import { Button, Checkbox, Input, InputNumber, Radio } from "antd";
import { getCookie } from "../../../utils/cookie";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 locale 추가
import jwtAxios from "../../../apis/jwt";

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  {
    label: <p className="select-none">취소/이용규정 동의</p>,
    value: "required-1",
  },
  {
    label: <p className="underline select-none">취소 정책 안내</p>,
    value: "required-2",
  },
  {
    label: <p className="underline select-none">개인 정보 수집 및 이용 동의</p>,
    value: "required-3",
  },
  {
    label: <p className="underline select-none">개인정보 제 3자 제공</p>,
    value: "required-4",
  },
  {
    label: <p className="select-none">마케팅 이용 동의</p>,
    value: "required-5",
  },
];
const defaultCheckedList = [];

const BookingIndex = () => {
  // 쿼리스트링
  const [searchParams, setSearchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  //recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  //쿠키
  const accessToken = getCookie("accessToken");
  //useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  console.log("locationState", locationState);
  const navigateBack = () => {
    navigate(-1);
  };

  const navigateCompleteBooking = () => {
    navigate(`/booking/complete`);
  };

  // useState
  const [userData, setUserData] = useState({});
  //    쿠폰
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [selectCoupon, setSelectCoupon] = useState({});
  //    체크박스
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [isChecked, setIsChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  //    금액

  const [point, setPoint] = useState(0);
  const [usePoint, setUsePoint] = useState(0);

  const [discount, setDiscount] = useState(0);
  const [finallPrice, setFinallPrice] = useState(
    locationState?.item.menuPrice || 0,
  );
  useEffect(() => {
    console.log("userData", userData);
  }, [userData]);
  useEffect(() => {
    console.log("couponList", couponList);
  }, [couponList]);
  useEffect(() => {
    console.log("selectCoupon", selectCoupon);
    if (selectCoupon.discountPer) {
      setDiscount(selectCoupon.discountPer);

      // 쿠폰 적용 시 포인트 사용액 재조정
      const originalPrice =
        locationState?.item.menuPrice * locationState?.quantity || 0;
      const newDiscountedPrice =
        originalPrice - originalPrice * (selectCoupon.discountPer / 100);

      // 현재 사용 중인 포인트가 새로운 할인가보다 크면 조정
      if (usePoint > newDiscountedPrice) {
        setUsePoint(newDiscountedPrice);
      }
    } else {
      setDiscount(0);
    }
  }, [selectCoupon]);
  useEffect(() => {
    setFinallPrice(
      locationState?.item.menuPrice -
        (discount / 100) * locationState?.item.menuPrice,
    );
  }, [discount]);
  // 유저 정보 불러오기
  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      setUserData(resultData.data);
    } catch (error) {
      console.log("회원 정보:", error);
    }
  };
  // 사용 가능한 쿠폰 불러오기
  const getAbleCouponList = async () => {
    try {
      const res = await axios.get(`/api/coupon/available-coupons`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("쿠폰 불러오기", res.data);
      const resultData = res.data;
      setCouponList(resultData.data.coupons);
    } catch (error) {
      console.log("쿠폰 불러오기 결과:", error);
    }
  };

  //예약하기
  const postBooking = async () => {
    const sendData = {
      num: 1,
      point: usePoint,
      strf_id: locationState.contentData.strfId,
      check_in: `${locationState.dates[0]} 00:00:00`,
      check_out: `${locationState.dates[1]} 00:00:00`,
      coupon_id: isNaN(parseInt(selectCoupon.couponId))
        ? null
        : parseInt(selectCoupon.couponId),
      actual_paid: calculateFinalPrice(),
      menu_id: locationState.item.menuId,
      room_id: locationState.isRoom[0].roomId,
      // order_list: [
      //   {
      //     menuId: locationState.item.menuId,
      //     quantity: locationState.quantity,
      //   },
      // ],
    };
    console.log(" 룸넘버", locationState.isRoom[0].roomNum[0]);
    console.log("sendData", sendData);
    try {
      const res = await axios.post(
        `/api/booking`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("예약하기 결과", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공" && resultData.data) {
        navigate("/booking/waiting");
        console.log("카카오페이먼트 도전");
        const paymentWindow = window.open(
          resultData.data,
          "_blank",
          "width=500,height=700",
        );

        if (!paymentWindow) {
          alert("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
        }
      } else {
        alert("결제 요청 실패");
      }
    } catch (error) {
      console.log("예약하기 결과:", error);
    }
  };

  // 포인트 확인
  const getPoint = async () => {
    try {
      const res = await jwtAxios.get(`/api/point/remain-point`);
      setPoint(res.data.data);
      console.log("Point ", res.data.data);
    } catch (error) {
      console.log(" error", error);
    }
  };

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(list.length > 0 && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };
  const onCheckAllChange = e => {
    const isChecked = e.target.checked;
    setCheckedList(isChecked ? plainOptions.map(option => option.value) : []);
    setIndeterminate(false);
    setCheckAll(isChecked);
  };

  const formatDate = dateString => {
    return dayjs(dateString)
      .locale("ko") // 한국어 설정
      .format("YYYY년 MM월 DD일 (ddd)");
  };

  // 포인트 입력 핸들러
  const handlePointChange = e => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;

    // 상품 가격에서 쿠폰 할인된 금액 계산
    const originalPrice =
      locationState?.item.menuPrice * locationState?.quantity || 0;
    const discountedPrice = originalPrice - calculateDiscount();

    // 할인된 가격을 초과하지 않는 선에서 포인트 사용
    if (value > discountedPrice) {
      setUsePoint(discountedPrice);
    } else if (value > point) {
      setUsePoint(point);
    } else if (value < 0) {
      setUsePoint(0);
    } else {
      setUsePoint(value);
    }
  };

  // 전액사용 버튼 클릭 시
  const handleUseAllPoints = () => {
    const discountedPrice =
      (locationState?.item.menuPrice * locationState?.quantity || 0) -
      calculateDiscount();
    // 보유 포인트와 할인된 가격 중 작은 값을 사용
    setUsePoint(Math.min(point, discountedPrice));
  };

  const calculateDiscount = () => {
    if (!discount || discount === 0) return 0;
    const originalPrice = locationState?.item.menuPrice || 0;
    return Math.floor(originalPrice * (discount / 100));
  };

  const calculateFinalPrice = () => {
    const originalPrice =
      locationState?.item.menuPrice * locationState?.quantity || 0;
    const discountAmount = (discount / 100) * originalPrice;
    const finalPrice = originalPrice - discountAmount - usePoint;

    // 최종 금액이 0 미만이 되지 않도록 체크
    return Math.max(0, finalPrice);
  };

  // 화면 최초 실행
  useEffect(() => {
    getUserInfo();
    getPoint();
    getAbleCouponList();
  }, []);
  return (
    <div>
      <TitleHeader icon="back" title="예약하기" onClick={navigateBack} />
      <div className="flex flex-col">
        {/* 예약 정보 */}
        <div className="flex flex-col ">
          <h2 className="px-4  py-3 border-b border-slate-100 text-lg text-slate-700 font-semibold">
            {locationState?.contentData.strfTitle || "업체이름"}
          </h2>
          <ul className="flex flex-col gap-6 py-4 px-4">
            <li className="flex items-center">
              <h4 className="w-1/2 text-base text-slate-700 font-semibold">
                객실명
              </h4>
              <p className="w-1/2 text-base text-slate-700">
                {locationState?.item.menuTitle || "객실명"}
              </p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-base text-slate-700 font-semibold">
                입실일
              </h4>
              <p className="w-1/2 text-base text-primary tracking-tight">
                {formatDate(locationState?.dates[0])}
              </p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-base text-slate-700 font-semibold">
                퇴실일
              </h4>
              <p className="w-1/2 text-base text-slate-700 tracking-tight">
                {formatDate(locationState?.dates[1])}
              </p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-base text-slate-700 font-semibold">
                인원
              </h4>
              <p className="w-1/2 text-base text-slate-700">
                성인 {locationState?.quantity}명
              </p>
            </li>
          </ul>
        </div>
        <section className="w-full h-[10px] bg-slate-100" />
        {/* 예약자 정보 입력 */}
        <div className="flex flex-col">
          <h2 className="p-4 border-b border-slate-100 text-lg text-slate-700 font-semibold">
            예약자 정보 입력
          </h2>
          <ul className="flex flex-col gap-3 py-3 px-4">
            <li className="flex items-center gap-3">
              <h4 className="text-sm text-slate-700">예약자</h4>
              <input
                type="text"
                className="flex-grow text-xs text-slate-400 
                          border border-slate-300 rounded-lg
                          p-3 outline-none bg-slate-50"
                value={userData?.name || "이름입니다."}
                readOnly
              />
            </li>
            <li className="flex items-center gap-3">
              <h4 className="text-sm text-slate-700">이메일</h4>
              <input
                type="text"
                className="flex-grow text-xs text-slate-400 
                          border border-slate-300 rounded-lg
                          p-3 outline-none bg-slate-50"
                value={userData?.email || "이메일입니다."}
                readOnly
              />
            </li>
            <li className="flex items-center gap-3">
              <h4 className="text-sm text-slate-700">휴대폰</h4>
              <input
                type="text"
                className="flex-grow text-xs text-slate-400 
                          border border-slate-300 rounded-lg
                          p-3 outline-none bg-slate-50"
                value={userData?.tell || "휴대폰 번호입니다."}
                readOnly
              />
            </li>
          </ul>
        </div>
        <section className="w-full h-[10px] bg-slate-100" />
        {/* 할인쿠폰 */}
        <div className="flex flex-col">
          <h2 className="p-4 border-b border-slate-100 text-lg text-slate-700 font-semibold">
            할인쿠폰
          </h2>
          <div className="flex flex-col gap-3 py-3 px-4">
            <button
              type="button"
              onClick={() => {
                if (couponList.length > 0) {
                  setShowCouponModal(true);
                }
              }}
              className={`p-3 rounded-lg
            border border-slate-300
            flex items-center justify-between
            ${couponList.length > 0 ? "bg-white" : "bg-slate-200"}`}
            >
              <p className="text-xs text-slate-500">
                {selectCoupon.title
                  ? selectCoupon.title
                  : couponList.length > 0
                    ? `사용 가능한 쿠폰이 ${couponList.length}개 있어요.`
                    : "사용 가능한 쿠폰이 없어요."}
              </p>
              <IoIosArrowDown className="text-[18px] text-slate-400" />
            </button>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-sm text-slate-700 whitespace-nowrap mr-[8px]">
                  포인트
                </p>

                <Input
                  type="number"
                  value={usePoint}
                  onChange={handlePointChange}
                  className="text-xs text-right border p-3"
                  min={0}
                  max={point}
                />
                <Button
                  onClick={handleUseAllPoints}
                  className="text-xs text-slate-500 h-auto py-3"
                >
                  전액사용
                </Button>
              </div>
              <sub className="w-full inline-block text-xs text-slate-500 text-right bottom-0">
                보유 포인트 : {point.toLocaleString()}p
              </sub>
            </div>
          </div>
        </div>
        <section className="w-full h-[10px] bg-slate-100" />

        {/* 결제 정보 */}
        <div className="flex flex-col">
          <h2 className="p-4 border-b border-slate-100 text-lg text-slate-700 font-semibold">
            결제정보
          </h2>
          <ul className="flex flex-col gap-3 px-4 py-3 w-full">
            <li className="w-full flex items-center justify-between">
              <h4 className="text-sm text-slate-500">예약 금액</h4>
              <p className="text-base text-slate-700">
                {(locationState?.item.menuPrice || 0).toLocaleString()}원
              </p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-sm text-slate-500">상품 할인</h4>
              <p className="text-base text-slate-700">0원</p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-sm text-slate-500">포인트사용</h4>
              <p className="text-base text-slate-700">
                {usePoint === 0 ? "0원" : `-${usePoint.toLocaleString()}원`}
              </p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-sm text-slate-500">쿠폰 할인</h4>
              <p className="text-base text-slate-700">
                {calculateDiscount().toLocaleString()}원
              </p>
            </li>
          </ul>
          <div className="w-full flex items-center justify-between py-3 px-4 border-t border-slate-100">
            <h4 className="text-base text-primary font-semibold">
              총 결제 금액
            </h4>
            <p className="text-lg text-primary font-semibold">
              <span>{calculateFinalPrice().toLocaleString()}</span>원
            </p>
          </div>
        </div>
        <section className="w-full h-[10px] bg-slate-100" />

        {/* 결제 수단*/}

        {/* 결제 혜택 */}
        <div className="py-3 px-4">
          <h2 className="text-lg font-semibold text-slate-700 ml-1 mb-3">
            결제수단
          </h2>
          <div className="px-3 py-4 border-[1px] border-slate-200 rounded-lg flex items-center justify-between mb-3">
            <Radio
              defaultChecked
              className="custom-payment-radio text-base text-slate-700"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/images/payment/payment_icon_yellow_small.png"
                  alt="payment_icon_yellow_small"
                  className="w-[60px]"
                />
                <span>카카오페이</span>
              </div>
            </Radio>
          </div>
          <div className="bg-slate-50 p-5 rounded-lg">
            <p className="text-lg text-slate-700 mb-[6px]">결제혜택</p>
            <p className="text-sm text-slate-500 tracking-tight">
              본 프로모션은 카카오페이 계정 기준 "기간 내 1회, 카카오페이머니
              결제"에 한해 페이포인트 적립 가능합니다. - 포인트 적립은 장바구니
              합산 기준으로 최종 결제 금액 4만원 이상 시 자동 적립되며,
              카카오페이 톡채널로 안내됩니다. (기간 내 누적 결제금액이 아닌 단건
              결제에 한함) - 기간 내 선착순 3천명 대상으로 예산 소진 시 별도
              고지 없이 조기 종료 될 수 있습니다. - 예산 소진 시 페이포인트 적립
              메세지가 발송되지 않습니다. - 포인트 사용 유효기간은 적립일로부터
              60개월입니다. - 적립된 포인트는 카카오페이 제휴 가맹점에서 사용
              가능합니다.
            </p>
          </div>
        </div>
        <div className="py-3 px-4">
          <h2 className="text-lg font-semibold text-slate-700">
            취소정책 및 이용 동의
          </h2>
          <Checkbox
            className="custom-payment-checkbox w-full text-base rounded-lg my-3 text-slate-700"
            checked={isChecked}
            onChange={e => setIsChecked(e.target.checked)}
          >
            주문 내용과 아래 유의 사항을 확인하였으며 결제 진행에 동의합니다.
          </Checkbox>
          <Button
            type="primary"
            disabled={!isChecked}
            onClick={() => postBooking()}
            className="w-full text-base py-3 !h-auto"
          >
            결제하기
          </Button>
          <p className="mt-3 text-sm text-slate-500">
            • 본 약관은 주식회사 카카오페이(이하 "회사"라 합니다)가 제공하는
            카카오페이 서비스의 이용과 관련하여 회사와 회원 사이의 권리, 의무 및
            책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
          </p>
        </div>
      </div>

      {/* 모달창 */}
      {showCouponModal ? (
        <SelectCoupon
          setShowCouponModal={setShowCouponModal}
          couponList={couponList}
          selectCoupon={selectCoupon}
          setSelectCoupon={setSelectCoupon}
        />
      ) : null}
    </div>
  );
};
export default BookingIndex;
