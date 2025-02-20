import { Form, Input, DatePicker, Checkbox, Button } from "antd";
import dayjs from "dayjs";
import React, { memo } from "react";
const { RangePicker } = DatePicker;
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "@emotion/styled";
import jwtAxios from "../../apis/jwt";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useResetRecoilState } from "recoil";
import { editTripAtom } from "../../atoms/EditTripAtom";
dayjs.extend(customParseFormat);

const StyledCheckbox = styled(Checkbox)`
  && {
    .ant-checkbox {
      order: 2;
      transform: scale(2);
      margin-left: 8px;
      margin-right: 0;

      // 체크박스를 동그라미로 만들기
      .ant-checkbox-inner {
        border-radius: 50%; // 동그라미 모양으로 변경
        &::after {
          inset-inline-start: 25%; // 체크 마크의 시작 위치를 조정
          top: 45%; // 상단 위치 미세 조정
          width: 5.714286px; // 체크 마크 크기 조정
          height: 9.142857px; // 체크 마크 크기 조정
        }
      }
    }
    .ant-checkbox-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    .ant-checkbox + span {
      order: 1;
      padding-left: 0;
      padding-right: 8px;
    }
  }
`;

const EditTripModal = ({ tripData, handleClickCancle, getTrip }) => {
  const [form] = Form.useForm();
  //쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = parseInt(searchParams.get("tripId"));
  //recoil
  const [editData, setEditData] = useRecoilState(editTripAtom);
  const resetEditData = useResetRecoilState(editTripAtom);
  //useNavigate
  const navigate = useNavigate();
  // 모달
  const handleBackgroundClick = () => {
    handleClickCancle();
  };
  const handleModalClick = e => {
    e.stopPropagation();
  };
  // 달력
  const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const handleDateChange = (values, formatString) => {
    console.log("선택된 날짜:", values); // dayjs 객체 배열
    console.log("포맷된 날짜:", formatString); // 'YYYY-MM-DD' 형식의 문자열 배열
    const makeSecondFormatDates = formatString?.map(item => item + ":00");
    setDates(makeSecondFormatDates);
  };
  const disabledDate = current => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };
  const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  });
  const disabledRangeTime = (_, type) => {
    if (type === "start") {
      return {
        disabledHours: () => range(0, 60).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => range(0, 60).splice(20, 4),
      disabledMinutes: () => range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  };
  const StyledRangePicker = styled(RangePicker)`
    .ant-picker-input input {
      color: "#334155" !important;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      width: 130px;
    }
  `;
  // api 여행 수정
  const patchTrip = async sendData => {
    try {
      const res = await jwtAxios.patch(`/api/trip`, sendData);
      console.log("여행 수정", res.data);
      const resultData = res.data;
      if (resultData) {
        getTrip();
        handleClickCancle();
      }
      if (resultData.code === "200 성공") {
        resetEditData();
      }
    } catch (error) {
      console.log("여행 수정", error);
    }
  };
  // 폼제출
  const handleFinish = values => {
    console.log(values);
    const { title, rangePicker, nowUser } = values;

    // nowUser가 있는지 확인하고 map 함수 실행
    const notUser = tripData?.nowUser
      ? tripData.nowUser
          .map(item => item.userId)
          .filter(userId => !values.nowUser?.includes(userId))
      : [];

    const joinUser =
      values.nowUser?.filter(userId => !notUser.includes(userId)) || [];

    const dateArr = rangePicker.map(item => item.format("YYYY-MM-DD"));
    console.log(dateArr);
    const sendData = {
      title: title,
      trip_id: tripId,
      start_at: dateArr[0],
      end_at: dateArr[1],
      // ins_user_list: joinUser,
      del_user_list: notUser,
      ins_location_list: [...tripData?.tripLocationList],
      del_location_list: [],
    };
    patchTrip(sendData);
  };
  // 지역 선택
  const handleLocationSelect = () => {
    console.log("지역 선택");
    setEditData({
      title: tripData.title,
      startDate: tripData.startAt,
      endDate: tripData.endAt,
      nowUser: tripData.tripUserIdList,
      tripLocationList: tripData.tripLocationList,
      from: `/schedule/index?tripId=${tripId}`,
      isEdit: true,
    });
    navigate("/search/location", {
      state: {
        tripLocationList: tripData.tripLocationList,
        from: `/schedule/index?tripId=${tripId}`,
      },
    });
  };
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
            max-w-3xl w-full mx-auto h-screen
            flex items-center justify-center
            bg-[rgba(0,0,0,0.5)]
            "
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white 
                rounded-2xl px-[60px] pt-[30px] pb-[10px]
                flex flex-col items-center justify-center
                gap-[20px]
                "
        onClick={handleModalClick}
      >
        {/* 지역 선택 */}
        <div className="flex gap-[20px]">
          <button type="button" onClick={handleLocationSelect}>
            지역 선택
          </button>
          <ul>
            {tripData?.tripLocationList?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        {/* 모달 내용 */}
        <Form
          form={form}
          onFinish={handleFinish}
          requiredMark={false}
          style={{ width: "100%" }}
        >
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력해주세요." }]}
            initialValue={tripData.title}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rangePicker"
            label="여행일자"
            rules={[{ required: true, message: "여행일자를 입력해주세요." }]}
            initialValue={
              tripData?.startAt && tripData?.endAt
                ? [dayjs(tripData.startAt), dayjs(tripData.endAt)]
                : undefined
            }
          >
            <RangePicker
              placeholder={["시작일 ", "종료일"]}
              disabledDate={disabledDate}
              variant="borderless"
              onChange={handleDateChange}
              separator={"~"}
            />
          </Form.Item>
          <Form.Item
            name="nowUser"
            label="참여자"
            initialValue={tripData?.tripUserIdList || []}
          >
            <Checkbox.Group>
              {tripData?.tripUserIdList?.map((item, index) => (
                <StyledCheckbox key={index} value={item} size="large">
                  {item}
                </StyledCheckbox>
              )) || null}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item
            style={{
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                color="default"
                variant="filled"
                htmlType="button"
                onClick={handleClickCancle}
                style={{ width: "50%" }}
              >
                취소
              </Button>
              <Button type="primary" htmlType="submit" style={{ width: "50%" }}>
                수정
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default memo(EditTripModal);
