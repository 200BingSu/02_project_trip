import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import axios from "axios";
import { USER } from "../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import SelectCoupon from "../../components/booking/SelectCoupon";
import { IoIosArrowDown } from "react-icons/io";
import { Button, Checkbox, Radio } from "antd";
import { getCookie } from "../../utils/cookie";

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
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  //    금액
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
      strf_id: locationState.contentData.strfId,
      check_in: locationState.dates[0],
      check_out: locationState.dates[1],
      coupon_id: isNaN(parseInt(selectCoupon.couponId))
        ? null
        : parseInt(selectCoupon.couponId),
      actual_paid: finallPrice,
      order_list: [
        {
          menuId: locationState.item.menuId,
          quantity: locationState.quantity,
        },
      ],
    };
    console.log("sendData", sendData);
    try {
      const res = await axios.post(
        `/api/booking`,
        { ...sendData },
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
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

  // 화면 최초 실행
  useEffect(() => {
    getUserInfo();
    getAbleCouponList();
  }, []);
  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} />
      <div className="flex flex-col">
        {/* 예약 정보 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            {locationState?.contentData.strfTitle || "업체이름"}
          </h2>
          <ul className="flex flex-col gap-[20px]">
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                객실명
              </h4>
              <p className="w-1/2 text-[18px] text-slate-700">
                {locationState?.item.menuTitle || "객실명"}
              </p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                입실일
              </h4>
              <p className="w-1/2 text-[18px] text-primary">
                {locationState?.dates[0]}
              </p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                퇴실일
              </h4>
              <p className="w-1/2 text-[18px] text-slate-700">
                {locationState?.dates[1]}
              </p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                인원
              </h4>
              <p className="w-1/2 text-[18px] text-slate-700">
                {locationState?.quantity}명
              </p>
            </li>
          </ul>
        </div>
        {/* 예약자 정보 입력 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            예약자 정보 입력
          </h2>
          <ul className="flex flex-col gap-[20px]">
            <li className="flex items-center gap-[50px]">
              <h4 className="text-[18px] text-slate-700 font-semibold">
                예약자
              </h4>
              <input
                type="text"
                className="flex-grow text-[18px] text-slate-400 
                          border border-slate-300 rounded-lg
                          px-[10px] py-[10px] outline-none bg-slate-100"
                value={userData?.name || "이름입니다."}
                readOnly
              />
            </li>
            <li className="flex items-center gap-[50px]">
              <h4 className="text-[18px] text-slate-700 font-semibold">
                이메일
              </h4>
              <input
                type="text"
                className="flex-grow text-[18px] text-slate-400 
                          border border-slate-300 rounded-lg
                          px-[10px] py-[10px] outline-none bg-slate-100"
                value={userData?.email || "이메일입니다."}
                readOnly
              />
            </li>
            {/* <li className="flex items-center gap-[50px]">
              <h4 className="text-[18px] text-slate-700 font-semibold">
                휴대폰
              </h4>
              <input
                type="text"
                className="flex-grow text-[18px] text-slate-400 
                          border border-slate-300 rounded-lg
                          px-[10px] py-[10px]"
                value={userData?.tell || "휴대폰 번호입니다."}
                readOnly
              />
            </li> */}
          </ul>
        </div>
        {/* 할인쿠폰 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            할인쿠폰
          </h2>
          <button
            type="button"
            onClick={() => {
              if (couponList.length > 0) {
                setShowCouponModal(true);
              }
            }}
            className={`px-[12px] py-[8px] h-[60px] rounded-lg
            border border-slate-300
            flex items-center justify-between
            ${couponList.length > 0 ? "bg-white" : "bg-slate-200"}`}
          >
            <p className="text-[16px] text-slate-500">
              {selectCoupon.title
                ? selectCoupon.title
                : couponList.length > 0
                  ? `사용 가능한 쿠폰이 ${couponList.length}개 있어요.`
                  : "사용 가능한 쿠폰이 없어요."}
            </p>
            <IoIosArrowDown className="text-[18px] text-slate-400" />
          </button>
        </div>
        {/* 결제 정보 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            결제정보
          </h2>
          <ul className="flex flex-col gap-[20px] w-full">
            <li className="w-full flex items-center justify-between">
              <h4 className="text-[18px] text-slate-700 font-semibold">
                예약 금액
              </h4>
              <p className="text-[18px] text-slate-700">
                {(locationState?.item.menuPrice || 0).toLocaleString()}원
              </p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-[18px] text-slate-700 font-semibold">
                쿠폰 할인
              </h4>
              <p className="text-[18px] text-slate-700">
                {discount === 0 ? "-" : `${discount}%`}
              </p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-[24px] text-primary font-semibold">
                총 결제 금액
              </h4>
              <p className="text-[24px] text-primary font-semibold">
                <span>
                  {/* {(
                    locationState?.item.menuPrice -
                    (selectCoupon.discountPer / 100) *
                      locationState?.item.menuPrice
                  ).toLocaleString()} */}
                  {(
                    locationState?.item.menuPrice * locationState?.quantity -
                    (discount / 100) *
                      (locationState?.item.menuPrice * locationState?.quantity)
                  ).toLocaleString()}
                </span>
                원
              </p>
            </li>
          </ul>
        </div>
        {/* 결제 수단*/}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            결제수단
          </h2>
          <div className="flex flex-col gap-[30px] w-full">
            <Radio.Group
              name="radiogroup"
              defaultValue={1}
              options={[
                {
                  value: 1,
                  label: (
                    <div className="flex items-center gap-[10px] pl-[20px]">
                      <img src="/images/booking/kakao.svg" alt="kakaopay" />
                      <p className="text-[18px] text-slate-700">카카오페이</p>
                    </div>
                  ),
                },
              ]}
              style={{ display: "flex", alignItems: "center" }}
            />
            {/* 결제 혜택 */}
            <div className="flex flex-col gap-[5px] px-[20px] py-[20px] rounded-lg bg-slate-100">
              <h4 className="text-[18px] text-slate-700 select-none">
                결제혜택
              </h4>
              <p className="text-[16px] text-slate-500 select-none">
                본 프로모션은 카카오페이 계정 기준 "기간 내 1회, 카카오페이머니
                결제"에 한해 페이포인트 적립 가능합니다.
              </p>
              <ul>
                <li className="flex gap-[5px]">
                  <p className="text-[16px] text-slate-500">-</p>
                  <p className="text-[16px] text-slate-500 ">
                    포인트 적립은 장바구니 합산 기준으로 최종 결제 금액 4만원
                    이상 시 자동 적립되며, 카카오페이 톡채널로 안내됩니다. (기간
                    내 누적 결제금액이 아닌 단건 결제에 한함)
                  </p>
                </li>
                <li className="flex gap-[5px]">
                  <p className="text-[16px] text-slate-500">-</p>
                  <p className="text-[16px] text-slate-500">
                    기간 내 선착순 3천명 대상으로 예산 소진 시 별도 고지 없이
                    조기 종료 될 수 있습니다.
                  </p>
                </li>
                <li className="flex gap-[5px]">
                  <p className="text-[16px] text-slate-500">-</p>
                  <p className="text-[16px] text-slate-500">
                    예산 소진 시 페이포인트 적립 메세지가 발송되지 않습니다.
                  </p>
                </li>
                <li className="flex gap-[5px]">
                  <p className="text-[16px] text-slate-500">-</p>
                  <p className="text-[16px] text-slate-500">
                    포인트 사용 유효기간은 적립일로부터 60개월입니다.
                  </p>
                </li>
                <li className="flex gap-[5px]">
                  <p className="text-[16px] text-slate-500">-</p>
                  <p className="text-[16px] text-slate-500">
                    적립된 포인트는 카카오페이 제휴 가맹점에서 사용 가능합니다.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* 취소 정책 및 이용 동의 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px]">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            취소 정책 및 이용 동의
          </h2>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            style={{ padding: "20px 10px" }}
            className="bg-slate-50 px-[10px] py-[20px] rounded-lg"
          >
            <span className="text-[18px] text-slate-600 font-semibold select-none">
              전체 동의합니다.
            </span>
          </Checkbox>
          <CheckboxGroup
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
            className="flex flex-col gap-[8px]"
          />
          <div className={`${checkAll ? `text-slate-500` : `text-secondary3`}`}>
            * 필수 동의 항목들의 체크가 필요합니다.
          </div>

          {/* 결제하기 */}
          <Button
            type="primary"
            className="h-[60px] px-[15px] py-[10px] rounded-lg "
            onClick={() => {
              if (checkAll) {
                postBooking();
              }
            }}
          >
            <p className="text-[24px] text-white font-semibold">결제하기</p>
          </Button>
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
