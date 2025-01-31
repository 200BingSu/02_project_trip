import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import axios from "axios";
import { USER } from "../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { useState } from "react";
import SelectCoupon from "../../components/booking/SelectCoupon";
import { IoIosArrowDown } from "react-icons/io";
import { Checkbox, Radio } from "antd";

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  {
    label: <p>취소/이용규정 동의</p>,
    value: "required-1",
  },
  {
    label: <p>취소 정책 안내</p>,
    value: "required-2",
  },
  {
    label: <p>개인 정보 수집 및 이용 동의</p>,
    value: "required-3",
  },
];
const defaultCheckedList = [];

const BookingIndex = () => {
  // 쿼리스트링
  const [searchParams, setSearchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  //recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  // useState
  const [userData, setUserData] = useState({});
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  // getUserInfo
  const getUserInfo = async () => {
    try {
      const res = await axios.get(`${USER.getUserInfo}`, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      console.log("찜하기", res.data);
      const filterData = {
        name: res.data.name,
        email: res.data.email,
      };
      setUserData(filterData);
    } catch (error) {
      console.log("회원 정보:", error);
    }
  };
  // 체크리스트
  // const indeterminate =
  //   checkedList.length > 0 && checkedList.length < plainOptions.length;
  // const onChange = list => {
  //   setCheckedList(list);
  // };
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
  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} />
      <div className="flex flex-col mt-[60px]">
        {/* 예약 정보 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            업체 이름
          </h2>
          <ul className="flex flex-col gap-[20px]">
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                객실명
              </h4>
              <p className="w-1/2 text-[18px] text-slate-700">객실명</p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                입실일
              </h4>
              <p className="w-1/2 text-[18px] text-primary">입실일</p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                퇴실일
              </h4>
              <p className="w-1/2 text-[18px] text-slate-700">퇴실일</p>
            </li>
            <li className="flex items-center">
              <h4 className="w-1/2 text-[18px] text-slate-700 font-semibold">
                인원
              </h4>
              <p className="w-1/2 text-[18px] text-slate-700">n명</p>
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
                          px-[10px] py-[10px]"
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
                          px-[10px] py-[10px]"
                value={userData?.email || "이메일입니다."}
                readOnly
              />
            </li>
            <li className="flex items-center gap-[50px]">
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
            </li>
          </ul>
        </div>
        {/* 할인쿠폰 */}
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            예약자 정보 입력
          </h2>
          <button
            type="button"
            onClick={() => {
              setShowCouponModal(true);
            }}
            className="px-[12px] py-[8px] h-[60px] rounded-lg
            border border-slate-300
            flex items-center justify-between"
          >
            <p className="text-[16px] text-slate-500">
              사용 가능한 쿠폰이 없어요.
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
                {(50000).toLocaleString()}원
              </p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-[18px] text-slate-700 font-semibold">
                쿠폰 할인
              </h4>
              <p className="text-[18px] text-slate-700">
                - {(5000).toLocaleString()}원
              </p>
            </li>
            <li className="w-full flex items-center justify-between">
              <h4 className="text-[24px] text-primary font-semibold">
                총 결제 금액
              </h4>
              <p className="text-[24px] text-primary font-semibold">
                {(50000 - 5000).toLocaleString()}원
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
                      <img
                        src="/public/images/booking/kakao.svg"
                        alt="kakaopay"
                      />
                      <p className="text-[18px] text-slate-700">카카오페이</p>
                    </div>
                  ),
                },
              ]}
            />
            {/* 결제 혜택 */}
            <div className="flex flex-col gap-[5px] px-[20px] py-[20px] rounded-lg bg-slate-100">
              <h4 className="text-[18px] text-slate-700">결제혜택</h4>
              <p className="text-[16px] text-slate-500">
                본 프로모션은 카카오페이 계정 기준 "기간 내 1회, 카카오페이머니
                결제"에 한해 페이포인트 적립 가능합니다.
              </p>
              <ul>
                <li className="flex gap-[5px]">
                  <p className="text-[16px] text-slate-500">-</p>
                  <p className="text-[16px] text-slate-500">
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
        <div className="px-[32px] py-[30px] flex flex-col gap-[30px] border-b-[10px] border-slate-100">
          <h2 className="pb-[20px] text-[24px] text-slate-700 font-semibold">
            취소 정책 및 이용 동의
          </h2>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            style={{ padding: "20px 10px" }}
          >
            <span className="text-[18px] text-slate-600 font-semibold">
              전체 동의합니다.
            </span>
          </Checkbox>
          <CheckboxGroup
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
            direction="vertical"
          />
        </div>
      </div>
      {/* 모달창 */}
      {showCouponModal ? (
        <SelectCoupon setShowCouponModal={setShowCouponModal} />
      ) : null}
    </div>
  );
};
export default BookingIndex;
