import { Input, message, Select, Spin, TimePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import { memo, ReactNode, useEffect, useState } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";
import { amenities } from "../../../constants/dataArr";
import { koreaAreaCodes } from "../../../constants/koreaAreaCode";
import { IAPI, IStrf } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import {
  categoryKor,
  matchAmenityIcon,
  matchRestDataToKor,
  matchState,
} from "../../../utils/match";

interface ListItemProps {
  children?: ReactNode;
  title: string | ReactNode;
  type: string;
}
const ListItem = ({ title, type }: ListItemProps): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const busiNum = userInfo.strfDtos[0].busiNum;
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const category = searchParams.get("category");
  // useNavigate
  const navigate = useNavigate();
  const navigateToEdit = () => {
    navigate(
      `/business/store/edit?strfId=${strfId}&category=${category}&edit=${type}`,
    );
  };
  //recoil
  const [strfData, setStrfData] = useRecoilState(strfAtom);
  // console.log("strfData", strfData);
  //useState
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<any>(null);

  const [, setAreaCode] = useState<string>("");

  // 편의 시설 클릭
  const handleAmenityClick = (amenityId: number) => {
    if (strfData.amenity?.includes(amenityId) === true) {
      setStrfData({
        ...strfData,
        amenity: strfData.amenity.filter(item => item !== amenityId),
      });
    } else {
      setStrfData({
        ...strfData,
        amenity: [...strfData.amenity, amenityId],
      });
    }
  };
  // API 상품 조회
  const getStrfInfo = async (): Promise<IAPI<IStrf> | null> => {
    const url = "/api/detail/member";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<IStrf>>(`${url}?strf_id=${strfId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setStrfData({ ...strfData, ...resultData.data });
        setIsLoading(false);
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      console.log("상품조회", error);
      return null;
    }
  };

  // API 이름 변경
  const updateTitle = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/title";
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      title: value,
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.put<IAPI<string>>(
        `${url}?strfId=${strfId}&title=${value}&busiNum=${busiNum}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log(resultData);
      if (resultData) {
        getStrfInfo();
        setIsLoading(false);
        setStrfData({ ...strfData, strfTitle: value });
        message.success("업체명 변경이 변경되었습니다");
      }
      return resultData;
    } catch (error) {
      console.log("이름 변경", error);
      setIsLoading(false);
      message.error("업체명 변경에 실패했습니다.");
      return null;
    }
  };
  // API 영업 상태 변경
  const updateState = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/state";
    const payload = {
      strfId,
      busiNum,
      state: strfData.state,
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.put(
        `${url}?strfId=${strfId}&state=${strfData.state}&busiNum=${busiNum}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("영업 상태 변경", resultData);
      if (resultData.code === "200 성공") {
        setIsLoading(false);
        getStrfInfo();
        message.success("영업 상태 변경에 성공했습니다.");
      }

      return resultData;
    } catch (error) {
      console.log("영업 상태 변경", error);
      message.error("영업 상태 변경에 실패했습니다.");
      setIsLoading(false);
      return null;
    }
  };
  // API 전화번호 변경
  const updateTell = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/tell";
    setIsLoading(true);
    const payload = {
      strfId: strfId,
      tell: `${strfData.areaCode}-${strfData.tell}`,
      busiNum: busiNum,
    };
    try {
      const res = await axios.put(
        `${url}?strfId=${strfId}&tell=${strfData.areaCode}-${strfData.tell}&busiNum=${busiNum}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code) {
        setIsLoading(false);
        getStrfInfo();
        message.success("전화번호 변경이 완료되었습니다");
      }
      console.log("전화번호 변경", resultData);
      return resultData;
    } catch (error) {
      setIsLoading(false);
      message.error("전화번호 변경에 실패하였습니다");
      console.log("전화번호 변경", error);
      return null;
    }
  };
  // API 업체 소개 변경
  const updateDetail = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/detail";
    setIsLoading(true);
    const payload = {
      strfId: strfId,
      detail: strfData.detail,
      busiNum: busiNum,
    };
    try {
      const res = await axios.put(
        `${url}?strfId=${strfId}&detail=${strfData.detail}&busiNum=${busiNum}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code) {
        setIsLoading(false);
        getStrfInfo();
        message.success("업체 소개 변경이 완료되었습니다");
      }
      console.log("업체소개 변경", resultData);
      return resultData;
    } catch (error) {
      setIsLoading(false);
      message.error("업체소개 변경에 실패하였습니다");
      console.log("업체소개 변경", error);
      return null;
    }
  };
  //  API 편의시설 변경
  const updateAmenity = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/amenity";
    setIsLoading(true);
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      category: categoryKor(category),
      ameniPoints: strfData.amenity,
    };
    const formatAmenity = strfData.amenity.map(item => {
      return `ameniPoints=${item}`;
    });
    console.log("보낼 파라메터", formatAmenity.join("&"));
    try {
      const res = await axios.put(
        `${url}?strfId=${strfId}&busiNum=${busiNum}&category=${category}&${formatAmenity.join("&")}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData.code) {
        setIsLoading(false);
        getStrfInfo();
        message.success("편의시설 변경이 완료되었습니다");
      }
      console.log("편의시설 변경", resultData);
      return resultData;
    } catch (error) {
      setIsLoading(false);
      message.error("편의시설 변경에 실패하였습니다");
      console.log("편의시설 변경", error);
      return null;
    }
  };
  // API 체크인/체크아웃 변경
  const updateCheckTime = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/time";
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      openCheckIn: strfData.openCheck,
      closeCheckOut: strfData.closeCheck,
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.put<IAPI<string>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}&openCheckIn=${strfData.openCheck}&closeCheckOut=${strfData.closeCheck}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("체크시간 변경", resultData);
      if (resultData) {
        getStrfInfo();
        setIsLoading(false);
        setStrfData({ ...strfData, strfTitle: value });
        message.success("체크시간 변경이 변경되었습니다");
      }
      return resultData;
    } catch (error) {
      console.log("체크시간 변경", error);
      setIsLoading(false);
      message.error("체크시간 변경에 실패했습니다.");
      return null;
    }
  };
  // API 축제 기간
  const updateDuration = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/fest/time";
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      startAt: strfData.startAt,
      endAt: strfData.endAt,
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.put<IAPI<string>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}&startAt=${strfData.startAt}&endAt=${strfData.endAt}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("기간 변경", resultData);
      if (resultData) {
        getStrfInfo();
        setIsLoading(false);
        setStrfData({ ...strfData, strfTitle: value });
        message.success("기간이 변경되었습니다");
      }
      return resultData;
    } catch (error) {
      console.log("기간 변경", error);
      setIsLoading(false);
      message.error("기간 변경에 실패했습니다.");
      return null;
    }
  };
  // API 휴무일 변경
  const updateRestDate = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/rest";
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      restDates: strfData.restDate,
    };
    console.log("payload", payload);
    setIsLoading(true);
    const restDatesPara = strfData.restDate
      .map(item => `restDates=${item}`)
      .join("&");
    console.log("restDatesPara", restDatesPara);
    try {
      const res = await axios.put<IAPI<string>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}&${restDatesPara}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("휴무일 변경", resultData);
      if (resultData) {
        getStrfInfo();
        setIsLoading(false);
        setStrfData({ ...strfData, strfTitle: value });
        message.success("휴무일이 변경되었습니다");
      }
      return resultData;
    } catch (error) {
      console.log("휴무일 변경", error);
      setIsLoading(false);
      message.error("휴무일 변경에 실패했습니다.");
      return null;
    }
  };
  // 수정/완료 클릭
  const handleClickButton = () => {
    if (type === "strfPic") {
      navigateToEdit();
      console.log("d이동");
      return;
    }
    setIsEdit(!isEdit);
    if (isEdit === true) {
      type === "title" && updateTitle();
      type === "state" && updateState();
      type === "tell" && updateTell();
      type === "detail" && updateDetail();
      type === "amenity" && updateAmenity();
      type === "duration" && updateDuration();
      type === "checkTime" && updateCheckTime();
      type === "restDate" && updateRestDate();
    }
  };
  const selectOptions = [
    { value: 0, label: "영업중" },
    { value: 1, label: "휴업" },
    { value: 2, label: "폐업" },
  ];

  // 전화번호
  const selectBefore = (
    <Select
      defaultValue={strfData.areaCode}
      onChange={e => {
        setStrfData({ ...strfData, areaCode: e });
      }}
    >
      {koreaAreaCodes.map(item => {
        return (
          <Select.Option key={item.code} value={item.code}>
            {item.code}
          </Select.Option>
        );
      })}
    </Select>
  );
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");
    // 7자리까지만 허용
    const trimmed = numbers.slice(0, 7);
    // 000-0000 형식으로 변환
    if (trimmed.length > 3) {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    }
    return trimmed;
  };

  const scheduleOptions = {
    frequency: [
      { label: "없음", value: "" },
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
  useEffect(() => {
    if (type === "tell" && typeof strfData.tell === "string") {
      const tellNum = strfData.tell
        ? strfData.tell.split("-")
        : ["000", "0000", "0000"];
      // console.log(tellNum);
      setAreaCode(tellNum[0]);
      setValue(`${tellNum[1]}-${tellNum[2]}`);
    }
    if (type === "detail" && typeof strfData.detail === "string") {
      setValue(strfData.detail);
    }
  }, [strfData, type]);

  return (
    <section className="px-7 pt-4 pb-5 flex flex-col gap-2 border-b-2 border-slate-100">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
        <button
          type="button"
          className="flex items-center gap-1 text-primary font-semibold hover:text-primary2 transition-all duration-300"
          onClick={handleClickButton}
        >
          {!isEdit && (
            <>
              <BiSolidEditAlt />
              변경
            </>
          )}
          {isEdit && <>완료</>}
        </button>
      </div>
      <Spin spinning={isLoading}>
        {!isEdit && (
          <div className="text-lg font-medium text-slate-500 px-2 py-1">
            {type === "title" && strfData.strfTitle}
            {type === "state" && matchState(strfData.state)}
            {type === "tell" &&
              (strfData.areaCode
                ? `${strfData.areaCode}-${strfData.tell}`
                : `${strfData.tell}`)}
            {type === "detail" && strfData.detail}
            {type === "amenity" && (
              <ul className="flex flex-wrap items-center gap-3 ">
                {strfData.amenity.map((item, index) => {
                  if (index < strfData.amenity.length - 1) {
                    return <li key={index}>{matchAmenityIcon(item)},</li>;
                  } else {
                    return <li key={index}>{matchAmenityIcon(item)}</li>;
                  }
                })}
              </ul>
            )}
            {type === "duration" && `${strfData.startAt}~${strfData.endAt}`}
            {type === "checkTime" &&
              `${strfData.openCheck}~${strfData.closeCheck}`}
            {type === "restDate" &&
              strfData.restDate.map((item, index) => {
                return index === strfData.restDate.length - 1 ? (
                  <span key={index}>{matchRestDataToKor(item)}</span>
                ) : (
                  <span key={index}>{matchRestDataToKor(item)}, </span>
                );
              })}
            {type === "strfPic" && <div>사진</div>}
          </div>
        )}
        {isEdit && type === "title" && (
          <Input
            size="large"
            defaultValue={strfData.strfTitle as string}
            placeholder="업체 이름을 입력해주세요"
            onChange={e => {
              setValue(e.target.value);
            }}
          />
        )}
        {isEdit && type === "state" && (
          <Select
            defaultValue={strfData.state}
            options={selectOptions}
            size="large"
            className="w-1/3 "
            onChange={e => setStrfData({ ...strfData, state: e })}
          />
        )}
        {isEdit && type === "tell" && (
          <Input
            addonBefore={selectBefore}
            size="large"
            defaultValue={strfData.tell}
            placeholder="전화번호를 입력해주세요."
            onChange={e => setStrfData({ ...strfData, tell: e.target.value })}
            value={formatPhoneNumber(strfData.tell ?? "0")}
            maxLength={8}
          />
        )}
        {isEdit && type === "detail" && (
          <TextArea
            placeholder="업체 소개를 작성해주세요"
            maxLength={300}
            onChange={e => {
              setStrfData({ ...strfData, detail: e.target.value });
            }}
            style={{ resize: "none", height: "27.73vw", padding: "20px" }}
            value={strfData.detail}
          />
        )}
        {isEdit && type === "amenity" && (
          <div className="flex flex-wrap gap-2">
            {amenities.map((item, index) => (
              <button
                type="button"
                key={index}
                className={`flex text-base items-center gap-2
                          border rounded-2xl w-fit px-2 py-1
                          ${strfData.amenity.includes(item.amenity_id as number) ? "border-primary text-primary" : "border-slate-300 text-slate-500"}`}
                onClick={() => handleAmenityClick(item.amenity_id as number)}
              >
                {item.icon}
                {item.key}
              </button>
            ))}
          </div>
        )}
        {isEdit && type === "busiHour" && (
          <div>
            <TimePicker.RangePicker
              defaultValue={[dayjs(strfData.startAt), dayjs(strfData.endAt)]}
              format={"HH:mm"}
            />
          </div>
        )}
        {isEdit && type === "checkTime" && (
          <div>
            <TimePicker.RangePicker
              defaultValue={[
                dayjs(
                  strfData?.openCheck && strfData.openCheck !== ""
                    ? strfData.openCheck
                    : "00:00",
                  "HH:mm",
                ),
                dayjs(
                  strfData?.closeCheck && strfData.closeCheck !== ""
                    ? strfData.closeCheck
                    : "00:00",
                  "HH:mm",
                ),
              ]}
              minuteStep={10}
              format={"HH:mm"}
              onChange={e => {
                if (e) {
                  setStrfData({
                    ...strfData,
                    openCheck: e[0] ? e[0].format("HH:mm") : "",
                    closeCheck: e[1] ? e[1].format("HH:mm") : "",
                  });
                }
              }}
            />
          </div>
        )}
        {isEdit && type === "restDate" && (
          <div className="flex gap-3">
            <Select
              options={scheduleOptions.frequency}
              placeholder="휴무 주기"
              defaultValue={"weekly"}
              size="large"
              disabled
            />
            <Select
              options={scheduleOptions.day}
              placeholder="요일 선택"
              size="large"
              mode="multiple"
              allowClear
              className="w-full"
              defaultValue={strfData.restDate.map(item =>
                matchRestDataToKor(item),
              )}
              onChange={value => {
                console.log(value);
                setStrfData({
                  ...strfData,
                  restDate: value,
                });
              }}
            />
          </div>
        )}
      </Spin>
    </section>
  );
};

export default memo(ListItem);
