import { Button, message, Steps } from "antd";
import { useRef, useState, forwardRef, RefObject } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import Step1 from "../../../components/business/register/Step1";
import Step2 from "../../../components/business/register/Step2";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { moveTo } from "../../../utils/moveTo";
import Step3 from "../../../components/business/register/Step3";

export interface StepRef {
  categoryRef?: React.RefObject<HTMLLIElement>;
  nameRef?: React.RefObject<HTMLLIElement>;
  locationRef?: React.RefObject<HTMLLIElement>;
  tellRef?: React.RefObject<HTMLLIElement>;
  picRef?: React.RefObject<HTMLLIElement>;
  businessHoursRef?: React.RefObject<HTMLLIElement>;
  checkTimeRef?: React.RefObject<HTMLLIElement>;
  holidayRef?: React.RefObject<HTMLLIElement>;
  bioRef?: React.RefObject<HTMLLIElement>;
}

const RegisterIndex = (): JSX.Element => {
  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate("/business");
  };
  //recoil
  const registerData = useRecoilValue(registerAtom);
  console.log("registerData", registerData);
  //useState
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [errorLocation, setErrorLocation] =
    useState<RefObject<HTMLLIElement> | null>(null);
  const [current, setCurrent] = useState<number>(0);
  //useRef
  const categoryRef = useRef<HTMLLIElement>(null);
  const nameRef = useRef<HTMLLIElement>(null);
  const locationRef = useRef<HTMLLIElement>(null);
  const tellRef = useRef<HTMLLIElement>(null);
  const picRef = useRef<HTMLLIElement>(null);
  const businessHoursRef = useRef<HTMLLIElement>(null);
  const checkTimeRef = useRef<HTMLLIElement>(null);
  const holidayRef = useRef<HTMLLIElement>(null);
  const bioRef = useRef<HTMLLIElement>(null);

  const steps = [
    {
      title: "",
      content: (
        <Step1
          categoryRef={categoryRef}
          nameRef={nameRef}
          locationRef={locationRef}
          tellRef={tellRef}
        />
      ),
    },
    {
      title: "",
      content: (
        <Step2
          picRef={picRef}
          businessHoursRef={businessHoursRef}
          checkTimeRef={checkTimeRef}
          holidayRef={holidayRef}
          bioRef={bioRef}
        />
      ),
    },
    {
      title: "",
      content: <Step3 />,
    },
  ];

  const onChange = (value: number) => {
    console.log("onChange:", value);
    setCurrent(value);
  };
  const next = () => {
    const error = matchErrorMessage();
    if (error) {
      setErrorMessage(true);
      setErrorLocation(error.ref);
      return;
    }
    setErrorMessage(false);
    setErrorLocation(null);
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map(item => ({
    key: item.title,
    title: item.title,
  }));
  // 에러메세지
  const matchErrorMessage = () => {
    if (current === 0) {
      if (!registerData.category) {
        return { message: "카테고리를 선택해주세요.", ref: categoryRef };
      }
      if (!registerData.name) {
        return { message: "업체 이름을 입력해주세요.", ref: nameRef };
      }
      if (!registerData.location?.address || !registerData.location?.postcode) {
        return { message: "업체 주소를 입력해주세요.", ref: locationRef };
      }
      if (!registerData.tell?.number) {
        return { message: "업체 전화번호를 입력해주세요.", ref: tellRef };
      }
    }
    if (current === 1) {
      if (registerData.image?.length === 0) {
        return { message: "업체 사진을 업로드해주세요.", ref: picRef };
      }
      if (
        !registerData.businessHours?.startTime ||
        !registerData.businessHours?.endTime
      ) {
        return { message: "영업시간을 입력해주세요.", ref: businessHoursRef };
      }
      if (!registerData.checkTime?.checkIn) {
        return { message: "체크인 시간을 입력해주세요.", ref: checkTimeRef };
      }
      if (!registerData.checkTime?.checkOut) {
        return { message: "체크아웃 시간을 입력해주세요.", ref: checkTimeRef };
      }
      if (
        registerData.holiday?.frequency !== "" &&
        registerData.holiday?.day?.length === 0
      ) {
        return { message: "휴무 요일을 선택해주세요.", ref: holidayRef };
      }
      if (
        (registerData.holiday?.day?.length ?? 0) > 0 &&
        registerData.holiday?.frequency === ""
      ) {
        return { message: "휴무 주기를 선택해주세요.", ref: holidayRef };
      }
      if (!registerData.bio) {
        return { message: "업체 소개를 작성해주세요.", ref: bioRef };
      }
    }
    return null;
  };
  return (
    <>
      <TitleHeaderTs title="업체 등록" onClick={navigateToBack} />
      <div>
        <Steps
          current={current}
          items={items}
          onChange={onChange}
          progressDot
          className="py-5"
          responsive={false}
        />
        <div className="w-full h-full px-4 mb-8">{steps[current].content}</div>
        <div
          className={`px-4 pb-8 flex items-center gap-4 ${current === 0 ? "justify-end" : "justify-between"}`}
        >
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
              size="large"
            >
              <IoIosArrowBack />
              이전
            </Button>
          )}
          {errorMessage && (
            <p
              className="text-error cursor-pointer"
              onClick={() => moveTo(errorLocation)}
            >
              {matchErrorMessage()?.message}
            </p>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" size="large">
              등록 신청
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              color="primary"
              variant="solid"
              onClick={() => next()}
              size="large"
            >
              다음
              <IoIosArrowForward />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterIndex;
