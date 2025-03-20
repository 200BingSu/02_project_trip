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
import { getCookie, setCookie } from "../../../utils/cookie";
import {
  categoryKor,
  matchAmenityIcon,
  matchRestDataToKor,
  matchRestDateKoToEn,
  matchState,
  transperRestValue,
} from "../../../utils/match";
import { ProductPic } from "../../../constants/pic";

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
  const [frequency, setFrequency] = useState("weekly");
  // useEffect(() => {
  //   console.log("value", value);
  // }, [value]);
  const [areaCode, setAreaCode] = useState<string>("");

  // 편의 시설 클릭
  const handleAmenityClick = (amenityId: number) => {
    if (value?.includes(amenityId) === true) {
      setValue((prev: any) => [
        ...prev.filter((item: any) => item !== amenityId),
      ]);
    } else {
      setValue((prev: any) => [...prev, amenityId]);
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
      // console.log("상품 조회", res.data);
      const resultData = res.data;
      if (resultData) {
        const splitTell = resultData.data.tell.split("-");
        // console.log("splitTell", splitTell);

        setStrfData(prevData => ({
          ...prevData,
          ...resultData.data,
          areaCode: splitTell[0],
          tell: `${splitTell[1]}-${splitTell[2]}`,
        }));

        setCookie("user", {
          ...userInfo,
          strfDtos: [
            { ...userInfo.strfDtos[0], title: resultData.data.strfTitle },
          ],
        });
        setIsLoading(false);
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      console.log("상품조회", error);
      return null;
    }
  };

  // API 이름 변경 v-s
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
      const res = await axios.patch<IAPI<string>>(
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
  // API 영업 상태 변경 v-s
  const updateState = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/state";
    const payload = {
      strfId,
      busiNum,
      state: value,
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.patch(
        `${url}?strfId=${strfId}&state=${value}&busiNum=${busiNum}`,
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
        setStrfData(prev => ({ ...prev, state: value }));
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

  // API 전화번호 변경 v-s
  const updateTell = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/tell";
    setIsLoading(true);
    const payload = {
      strfId: strfId,
      tell: `${areaCode}-${value}`,
      busiNum: busiNum,
    };
    try {
      const res = await axios.patch(
        `${url}?strfId=${strfId}&tell=${areaCode}-${value}&busiNum=${busiNum}`,
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
        setStrfData({
          ...strfData,
          areaCode: areaCode,
          tell: value.split("-", 1),
        });
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
  // API 업체 소개 변경 v-s
  const updateDetail = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/detail";
    setIsLoading(true);
    const payload = {
      strfId: strfId,
      detail: value,
      busiNum: busiNum,
    };
    try {
      const res = await axios.patch(
        `${url}?strfId=${strfId}&detail=${value}&busiNum=${busiNum}`,
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
        setStrfData(prev => ({ ...prev, detail: value }));
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
      ameniPoints: value,
    };
    const formatAmenity = strfData.amenity.map(item => {
      return `ameniPoints=${item}`;
    });
    console.log("보낼 파라메터", formatAmenity.join("&"));
    try {
      const res = await axios.patch(
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
  // API 편의시설 삭제
  const deleteAmenity = async () => {
    const url = "/api/detail/amenity/all";
    // const payload = strfData.amenity;
    try {
      const res = await axios.delete(
        `${url}?strfId=${strfId}&busiNum=${busiNum}`,
        {
          // data: payload,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData) {
        console.log("편의시설 삭제", resultData);
        updateAmenity();
      }
    } catch (error) {
      console.log("편의시설 삭제", error);
    }
  };
  // API 체크인/체크아웃 변경 v-s
  const updateCheckTime = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/time";
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      openCheckIn: value[0],
      closeCheckOut: value[1],
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.patch<IAPI<string>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}&openCheckIn=${value[0]}&closeCheckOut=${value[1]}`,
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
        setStrfData({ ...strfData, strfTitle: value[0], closeCheck: value[1] });
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
  // API 휴무일 변경 v-s
  const updateRestDate = async (): Promise<IAPI<string> | null> => {
    const url = "/api/detail/rest";
    const formatRestDates = value.map((item: string) =>
      matchRestDateKoToEn(item),
    );
    const payload = {
      strfId: strfId,
      busiNum: busiNum,
      restDates: formatRestDates,
    };
    console.log("payload", payload);
    setIsLoading(true);
    const restDatesPara = formatRestDates
      .map((item: string) => `restDates=${item}`)
      .join("&");
    console.log("restDatesPara", restDatesPara);
    try {
      const res = await axios.patch<IAPI<string>>(
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
        setStrfData(prev => ({
          ...prev,
          restDate: transperRestValue(value),
        }));
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
  // API 휴무일 삭제
  const deleteRestDate = async (): Promise<IAPI<number> | null> => {
    const url = "/api/detail/rest";
    try {
      const res = await axios.delete<IAPI<number>>(
        `${url}?strfId=${strfId}&busiNum=${busiNum}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      if (resultData) {
        console.log("영업 상태 삭제", resultData);
        updateRestDate();
      }
      return resultData;
    } catch (error) {
      console.log("영업 상태 삭제", error);
      return null;
    }
  };
  // 수정/완료 클릭
  const handleClickButton = () => {
    if (type === "strfPic") {
      navigateToEdit();
      return;
    }
    if (type === "address") {
      navigateToEdit();
      return;
    }
    setIsEdit(!isEdit);
    if (isEdit === false) {
      type === "title" && setValue(strfData.strfTitle);
      type === "tell" && setValue(strfData.tell);
      type === "tell" && setAreaCode(strfData.areaCode ?? "");
      type === "detail" && setValue(strfData.detail);
      type === "amenity" && setValue(strfData.amenity);
      type === "state" && setValue(strfData.state);
      type === "duration" && setValue(`${strfData.startAt}~${strfData.endAt}`);
      type === "checkTime" &&
        setValue([strfData.openCheck, strfData.closeCheck]);
      type === "restDate" &&
        setValue(strfData.restDate.map(item => matchRestDataToKor(item)));
    }
    if (isEdit === true) {
      if (type === "title") {
        if (value === strfData.strfTitle) {
          message.warning("동일한 이름으로 수정을 취소합니다");
        } else {
          value?.trim() !== "" && updateTitle();
        }
      }
      if (type === "state") {
        if (value === strfData.state) {
          message.warning("동일한 상태이기 때문에 수정을 취소합니다");
        } else {
          updateState();
        }
      }
      if (type === "tell") {
        if (areaCode === strfData.areaCode && value === strfData.tell) {
          message.warning("동일한 전화번호이기 때문에 수정을 취소합니다");
        } else {
          areaCode !== "" && value !== "" && updateTell();
        }
      }
      if (type === "detail") {
        if (value === strfData.detail) {
          message.warning("동일한 상품소개이기 때문에 수정을 취소합니다");
        } else {
          value.trim() !== "" && updateDetail();
        }
      }

      type === "amenity" && deleteAmenity();
      type === "duration" && updateDuration();
      type === "checkTime" && updateCheckTime();
      type === "restDate" && deleteRestDate();
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
        setAreaCode(e);
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
      { label: "없음", value: "none" },
      { label: "매주", value: "weekly" },
      // { label: "격주", value: "biweekly" },
    ],
    day: [
      { label: "월", value: "월" },
      { label: "화", value: "화" },
      { label: "수", value: "수" },
      { label: "목", value: "목" },
      { label: "금", value: "금" },
      { label: "토", value: "토" },
      { label: "일", value: "일" },
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
    if (type === "amenity") {
      setValue([...strfData.amenity]);
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
              strfData.openCheck &&
              strfData.closeCheck &&
              `${dayjs(strfData.openCheck, "HH:mm:ss").format("HH:mm")}~${dayjs(strfData.closeCheck, "HH:mm:ss").format("HH:mm")}`}
            {type === "restDate" &&
              strfData.restDate.map((item, index) => {
                return index === strfData.restDate.length - 1 ? (
                  <span key={index}>{matchRestDataToKor(item)}</span>
                ) : (
                  <span key={index}>{matchRestDataToKor(item)}, </span>
                );
              })}
            {type === "strfPic" && (
              <ul className="flex gap-2">
                {strfData.strfPics.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="bg-slate-100 rounded-lg overflow-hidden w-full max-h-[200px] h-[53.33vw]"
                    >
                      <img
                        src={`${ProductPic}/${strfId}/${item.strfPics}`}
                        alt={item.strfPics}
                        className="w-full h-full object-cover"
                      />
                    </li>
                  );
                })}
              </ul>
            )}
            {type === "address" && strfData.address}
          </div>
        )}
        {isEdit && type === "title" && (
          <Input
            size="large"
            defaultValue={strfData.strfTitle as string}
            placeholder="업체 이름을 입력해주세요(공백 입력시 이전 이름이 유지됩니다)"
            onChange={e => {
              setValue(e.target.value);
            }}
            status={value?.trim() === "" ? "error" : undefined}
          />
        )}
        {isEdit && type === "state" && (
          <Select
            defaultValue={strfData.state}
            options={selectOptions}
            size="large"
            className="w-1/3 "
            onChange={e => setValue(e)}
          />
        )}
        {isEdit && type === "tell" && (
          <Input
            addonBefore={selectBefore}
            size="large"
            defaultValue={strfData.tell}
            placeholder="전화번호를 입력해주세요."
            onChange={e => setValue(e.target.value)}
            value={formatPhoneNumber(value ?? "0")}
            maxLength={8}
            status={!areaCode || !value ? "error" : undefined}
          />
        )}
        {isEdit && type === "detail" && (
          <TextArea
            placeholder="업체 소개를 작성해주세요"
            maxLength={300}
            onChange={e => {
              setValue(e.target.value);
            }}
            style={{ resize: "none", height: "27.73vw", padding: "20px" }}
            value={value}
            status={value?.trim() === "" ? "error" : undefined}
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
                          ${value.includes(item.amenity_id as number) ? "border-primary text-primary" : "border-slate-300 text-slate-500"}`}
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
                  setValue([
                    e[0] ? e[0].format("HH:mm") : "",
                    e[1] ? e[1].format("HH:mm") : "",
                  ]);
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
              onChange={e => {
                if (e === "none") {
                  setStrfData({ ...strfData, restDate: [] });
                }
                setFrequency(e);
              }}
            />
            <Select
              options={scheduleOptions.day}
              placeholder="요일 선택"
              size="large"
              mode="multiple"
              allowClear
              className="w-full"
              value={value}
              onChange={value => {
                setValue(value);
              }}
              disabled={frequency === "none" ? true : false}
            />
          </div>
        )}
      </Spin>
    </section>
  );
};

export default memo(ListItem);
