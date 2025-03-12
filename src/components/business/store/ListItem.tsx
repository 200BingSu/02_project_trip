import { Input, message, Select, Spin, TimePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import dayjs from "dayjs";
import { memo, ReactNode, useEffect, useState } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";
import { amenities } from "../../../constants/dataArr";
import { koreaAreaCodes } from "../../../constants/koreaAreaCode";
import { Iamenity, IAPI, IStrf } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import { matchState } from "../../../utils/match";

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
  //recoil
  const [strfData, setStrfData] = useRecoilState(strfAtom);
  console.log("ListItem strfData", strfData);
  //useState
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState<any>(null);

  const [areaCode, setAreaCode] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  // 편의 시설 클릭
  const handleAmenityClick = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(prev => prev.filter(id => id !== amenityId));
    } else {
      setSelectedAmenities(prev => [...prev, amenityId]);
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
      state: value,
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      const res = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      console.log("이름 변경", resultData);
      if (resultData.code === "200 성공") {
        setIsLoading(false);
        getStrfInfo();
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
  const updateTell = async () => {
    const url = "/api/detail/tell";
    setIsLoading(false);
    try {
      const res = await axios.put(
        `${url}?strfId=${strfId}&tell=${strfData.tell}&busiNum=${busiNum}`,
      );
      const resultData = res.data;
      console.log("전화번호 변경", resultData);
    } catch (error) {
      console.log("전화번호 변경", error);
    }
  };
  // 수정/완료 클릭
  const handleClickButton = () => {
    setIsEdit(!isEdit);
    if (isEdit === true) {
      type === "title" && updateTitle();
      type === "state" && updateState();
    }
  };
  const selectOptions = [
    { value: 0, label: "영업중" },
    { value: 1, label: "휴업" },
    { value: 2, label: "폐업" },
  ];

  // 전화번호
  const selectBefore = (
    <Select defaultValue={areaCode}>
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
  // 타입가드
  // const isReactNode = (value: unknown): value is ReactNode => {
  //   return (
  //     typeof value === "string" ||
  //     typeof value === "number" ||
  //     typeof value === "boolean" ||
  //     value === null ||
  //     value === undefined ||
  //     React.isValidElement(value)
  //   );
  // };

  const isIamenityArray = (value: unknown): value is Iamenity[] => {
    return (
      Array.isArray(value) &&
      value.every(
        item =>
          typeof item === "object" &&
          type === "amenity" &&
          "amenityTitle" in item,
      )
    );
  };
  const isStringArray = (value: unknown): value is string[] => {
    return (
      Array.isArray(value) && value.every(item => typeof item === "string")
    );
  };
  const scheduleOptions = {
    frequency: [
      { label: "없음", value: "" },
      { label: "매주", value: "weekly" },
      { label: "격주", value: "biweekly" },
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
            {type === "tell" && strfData.tell}
            {type === "detail" && strfData.detail}
            {isIamenityArray(strfData) && (
              <ul>
                {strfData.map(amenity => (
                  <li key={amenity.amenityId}>
                    {amenity.icon} {amenity.amenityTitle}
                  </li>
                ))}
              </ul>
            )}
            {isStringArray(strfData) && (
              <>
                {type === "busiHour" && `${strfData[0]}~${strfData[1]}`}
                {type === "checkTime" && `${strfData[0]}~${strfData[1]}`}
                {type === "restDate" &&
                  strfData.map((item, index) => {
                    return index !== strfData.length ? (
                      <p key={index}>{item}</p>
                    ) : (
                      <p key={index}>{item},</p>
                    );
                  })}
              </>
            )}
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
            onChange={e => setValue(e)}
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
            maxLength={50}
            onChange={e => {
              setValue(e.target.value);
            }}
            style={{ resize: "none", height: "27.73vw", padding: "20px" }}
            value={value}
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
                          ${selectedAmenities.includes(item.amenity_id as number) ? "border-primary text-primary" : "border-slate-300 text-slate-500"}`}
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
                dayjs(strfData.openCheck, "HH:mm"),
                dayjs(strfData.closeCheck, "HH:mm"),
              ]}
              format={"HH:mm"}
              onChange={e => setValue(e)}
            />
          </div>
        )}
        {isEdit && type === "restDate" && (
          <div className="flex gap-3">
            <Select
              options={scheduleOptions.frequency}
              placeholder="휴무 주기"
              onChange={value => {
                setValue({ ...value, frequency: value });
              }}
              size="large"
            />
            <Select
              options={scheduleOptions.day}
              placeholder="요일 선택"
              size="large"
              mode="multiple"
              allowClear
              className="w-full"
              onChange={value => {
                setValue({ ...value, day: value });
              }}
            />
          </div>
        )}
      </Spin>
    </section>
  );
};

export default memo(ListItem);
