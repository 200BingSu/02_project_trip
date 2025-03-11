import { DatePicker, Select, TimePicker } from "antd";

import dayjs from "dayjs";
import { memo } from "react";
import { useRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import { StepRef } from "../../../pages/business/register/RegisterIndex";
import { CategoryType } from "../../../types/enum";

const Step2 = ({
  businessHoursRef,
  checkTimeRef,
  holidayRef,
}: StepRef): JSX.Element => {
  const [register, setRegister] = useRecoilState(registerAtom);

  // 휴무일
  const scheduleOptions = {
    frequency: [
      { label: "없음", value: "none" },
      { label: "매주", value: "weekly" },
      // { label: "격주", value: "biweekly" },
    ],
    day: [
      { label: "월", value: "mon" },
      { label: "화", value: "tue" },
      { label: "수", value: "wed" },
      { label: "목", value: "thu" },
      { label: "금", value: "fri" },
      { label: "토", value: "sat" },
      { label: "일", value: "sun" },
    ],
  };
  // 편의시설 추가
  // const handleAmenity = (amenity_id: number): void => {
  //   if (register.amenity && register.amenity.includes(amenity_id)) {
  //     setRegister(prev => ({
  //       ...prev,
  //       amenity: prev.amenity?.filter(item => item !== amenity_id),
  //     }));
  //   } else {
  //     setRegister(prev => ({
  //       ...prev,
  //       amenity: [...(prev.amenity || []), amenity_id],
  //     }));
  //   }
  // };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {/* 폼 */}
        <section className="flex flex-col gap-3">
          <ul className="flex flex-col gap-10 py-5">
            {/* 기간 */}
            {register.category === CategoryType.FEST && (
              <li className="flex flex-col gap-1" ref={businessHoursRef}>
                <h3 className="text-slate-700 text-lg font-semibold">
                  <i className="text-secondary3_3">*</i> 영업 시간
                </h3>
                <p className="text-base text-slate-500">
                  업체의 영업시간을 입력해주세요.
                </p>
                <DatePicker.RangePicker
                  placeholder={["축제 시작일", "축제 종료일"]}
                  size="large"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      duration: {
                        startAt: value?.[0]?.format("YYYY-MM-DD") || "",
                        endAt: value?.[1]?.format("YYYY-MM-DD") || "",
                      },
                    }));
                  }}
                  value={[
                    register.duration?.startAt
                      ? dayjs(register.duration?.startAt)
                      : null,
                    register.duration?.endAt
                      ? dayjs(register.duration?.endAt)
                      : null,
                  ]}
                />
              </li>
            )}

            {/* 체크인, 체크아웃 시간 */}
            <li className="flex flex-col gap-1" ref={checkTimeRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 입실/퇴실 시간
              </h3>
              <p className="text-base text-slate-500">
                숙소의 입실 및 퇴실 시간을 입력해주세요.
              </p>
              <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                입실
                <TimePicker
                  placeholder="입실 시간을 지정해주세요"
                  size="large"
                  className="w-full"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      checkTime: {
                        ...prev.checkTime,
                        checkIn: value?.format("HH:mm") || "",
                      },
                    }));
                  }}
                  format="HH:mm"
                  value={
                    register.checkTime?.checkIn
                      ? dayjs(register.checkTime?.checkIn, "HH:mm")
                      : null
                  }
                />
              </label>
              <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                퇴실
                <TimePicker
                  placeholder="퇴실 시간을 지정해주세요"
                  size="large"
                  className="w-full"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      checkTime: {
                        ...prev.checkTime,
                        checkOut: value?.format("HH:mm") || "",
                      },
                    }));
                  }}
                  format="HH:mm"
                  value={
                    register.checkTime?.checkOut
                      ? dayjs(register.checkTime?.checkOut, "HH:mm")
                      : null
                  }
                />
              </label>
            </li>
            {/* 휴일 */}
            <li className="flex flex-col gap-1" ref={holidayRef}>
              <h3 className="text-slate-700 text-lg font-semibold">휴무일</h3>
              <p className="text-base text-slate-500">
                정기 휴일이 있을 경우, 정기 휴무일을 작성해주세요.
              </p>
              <div className="flex gap-3">
                <Select
                  options={scheduleOptions.frequency}
                  placeholder="휴무 주기"
                  onChange={value => {
                    if (value === "none") {
                      setRegister(prev => ({
                        ...prev,
                        holiday: { frequency: value, day: [] },
                      }));
                    }
                    setRegister(prev => ({
                      ...prev,
                      holiday: { ...prev.holiday, frequency: value },
                    }));
                  }}
                  size="large"
                />
                <Select
                  options={scheduleOptions.day}
                  placeholder="요일 선택"
                  size="large"
                  mode="multiple"
                  allowClear
                  value={register.holiday?.day}
                  className="w-full"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      holiday: { ...prev.holiday, day: value },
                    }));
                  }}
                />
              </div>
            </li>

            {/* 업체 편의시설 */}
            {/* <li>
              <h3 className="text-slate-700 text-lg font-semibold">
                업체 편의시설
              </h3>
              <p className="text-base text-slate-500">
                업체 편의시설을 작성해주세요.
              </p>
              <div className="flex gap-3 flex-wrap px-3 py-3">
                {amenities.map(item => (
                  <div
                    key={item.amenity_id}
                    className={`flex gap-1 items-center border  rounded-xl px-2 py-1 cursor-pointer transition-all duration-300
                     ${register.amenity?.includes(item.amenity_id) ? "border-primary" : "border-slate-300"} `}
                    onClick={() => handleAmenity(item.amenity_id)}
                  >
                    <i className="text-sm text-slate-500">{item.icon}</i>
                    <p className="text-sm text-slate-700">{item.key}</p>
                  </div>
                ))}
              </div>
            </li> */}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default memo(Step2);
