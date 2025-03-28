import { Button, message, Spin, Steps } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { RefObject, useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import Step1 from "../../../components/business/register/Step1";
import Step2 from "../../../components/business/register/Step2";
import Step3 from "../../../components/business/register/Step3";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { CategoryType } from "../../../types/enum";
import { IAPI } from "../../../types/interface";
import { getCookie, setCookie } from "../../../utils/cookie";
import { categoryKor } from "../../../utils/match";
import { moveTo } from "../../../utils/moveTo";

dayjs.extend(customParseFormat);

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

interface PType {
  category: string;
  title: string;
  lat: number;
  lng: number;
  address: string;
  locationTitle: string;
  post: string;
  tell: string;
  startAt: string; // YYYY-MM-DD
  endAt: string;
  openCheckIn: string;
  closeCheckOut: string;
  detail: string;
  busiNum: string;
  state: number;
  restdates: string[];
}

interface postDataType {
  strfId: number;
  title: string;
  category: string;
}

const RegisterIndex = (): JSX.Element => {
  //useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };
  const navigateToComfirm = () => {
    navigate("/business/register/confirm");
  };
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const busiNum = userInfo?.strfDtos[0].busiNum ?? "";
  //recoil
  const resetRegister = useResetRecoilState(registerAtom);
  const registerData = useRecoilValue(registerAtom);
  console.log("registerData", registerData);
  //useState
  const [errorMessage, setErrorMessage] = useState<boolean>(false);
  const [errorLocation, setErrorLocation] =
    useState<RefObject<HTMLLIElement> | null>(null);
  const [current, setCurrent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  // API 상품 등록
  const createStrf = async (
    data: FormData,
  ): Promise<IAPI<postDataType> | null> => {
    const url = "/api/detail/info";
    setIsLoading(true);

    try {
      const res = await axios.post<IAPI<postDataType>>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("상품 등록", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        message.success("상품 등록이 완료되었습니다.");
        setIsLoading(false);
        resetRegister();
        navigateToComfirm();
        setCookie("user", {
          ...userInfo,
          strfDtos: [
            {
              ...userInfo.strfDtos[0],
              strfId: resultData.data.strfId,
              title: resultData.data.title,
              category: resultData.data.category,
            },
            ...userInfo.strfDtos,
          ],
        });
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      console.log("상품 등록", error);
      return null;
    }
  };
  // 제출
  const handleDone = async () => {
    const sendData: PType = {
      category: categoryKor(registerData.category) as string,
      title: `${registerData.name}`,
      lat: registerData.location?.latitude ?? 0,
      lng: registerData.location?.longitude ?? 0,
      address: `${registerData.location?.address} ${registerData.location?.addressDetail ?? null}`,
      locationTitle: registerData.locationTitle ?? "",
      post: registerData.location?.postcode ?? "",
      tell: `${registerData.tell?.areaCode}-${registerData.tell?.number}`,
      startAt:
        registerData.category === CategoryType.FEST
          ? dayjs(registerData.duration?.startAt, "YYYY-MM-DD").format(
              "YYYY-MM-DD",
            )
          : "",
      endAt:
        registerData.category === CategoryType.FEST
          ? dayjs(registerData.duration?.endAt, "YYYY-MM-DD").format(
              "YYYY-MM-DD",
            )
          : "",
      openCheckIn: dayjs(registerData.checkTime?.checkIn, "HH:mm").format(
        "HH:mm",
      ),
      closeCheckOut: dayjs(registerData.checkTime?.checkOut, "HH:mm").format(
        "HH:mm",
      ),

      detail: registerData.bio ?? "",
      busiNum: busiNum,
      state: 0,
      restdates: registerData.holiday?.day ?? [],
    };
    console.log("sendData", sendData);
    const formData = new FormData();
    formData.append(
      "p",
      new Blob([JSON.stringify(sendData)], { type: "application/json" }),
    );
    if (registerData.image?.length ?? 0 > 0) {
      registerData.image?.forEach(image => {
        formData.append("strfPic", image.originFileObj as File);
      });
    }
    console.log("p의 내용", formData.get("p"));
    await createStrf(formData);
    // await navigateToComfirm();
  };
  //  antD Step
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
          businessHoursRef={businessHoursRef}
          checkTimeRef={checkTimeRef}
          holidayRef={holidayRef}
        />
      ),
    },
    {
      title: "",
      content: <Step3 picRef={picRef} bioRef={bioRef} />,
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
      if (registerData.category === CategoryType.FEST) {
        if (!registerData.duration?.startAt || !registerData.duration?.endAt) {
          return { message: "영업시간을 입력해주세요.", ref: businessHoursRef };
        }
      }
      if (registerData.category === CategoryType.STAY) {
        if (!registerData.checkTime?.checkIn) {
          return { message: "체크인 시간을 입력해주세요.", ref: checkTimeRef };
        }
        if (!registerData.checkTime?.checkOut) {
          return {
            message: "체크아웃 시간을 입력해주세요.",
            ref: checkTimeRef,
          };
        }
      }

      if (
        (registerData.holiday?.day?.length ?? 0) > 0 &&
        registerData.holiday?.frequency === ""
      ) {
        return { message: "휴무 주기를 선택해주세요.", ref: holidayRef };
      }
    }
    if (current === 2) {
      if (registerData.image?.length === 0) {
        return { message: "업체 사진을 업로드해주세요.", ref: picRef };
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
      <Spin spinning={isLoading}>
        <Steps
          current={current}
          items={items}
          onChange={onChange}
          progressDot
          className="py-5"
          responsive={false}
        />
        <div className="px-4 flex flex-col gap-1">
          <h2 className="text-2xl font-semibold text-slate-600">
            업체의 정보를 작성해주세요({current + 1}/3)
          </h2>
          <p className="text-xs text-slate-400">
            허위 정보 기재 시 숙소 삭제, 이용 제한 및 법적 책임이 발생할 수
            있으니
            <br /> 정확한 정보를 입력해 주세요.
          </p>
        </div>
        <div className="w-full h-full px-4 mb-4">{steps[current].content}</div>
        <div
          className={`px-4 pb-8 flex items-center gap-4 ${current === 0 ? "justify-end" : "justify-between"}`}
        >
          {current > 0 && (
            <Button
              onClick={() => prev()}
              size="large"
              className="max-h-[50px] h-[16vw]"
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
            <Button
              type="primary"
              size="large"
              className="max-h-[50px] h-[16vw]"
              onClick={handleDone}
            >
              등록 신청
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button
              color="primary"
              variant="solid"
              onClick={() => next()}
              size="large"
              className="max-h-[50px] h-[16vw]"
            >
              다음
              <IoIosArrowForward />
            </Button>
          )}
        </div>
      </Spin>
    </>
  );
};

export default RegisterIndex;
