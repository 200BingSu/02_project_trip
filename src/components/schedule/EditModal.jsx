import { Button, Checkbox, DatePicker, Form, Input, Spin } from "antd";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
import customParseFormat from "dayjs/plugin/customParseFormat";
import styled from "@emotion/styled";
dayjs.extend(customParseFormat);
const StyledCheckbox = styled(Checkbox)`
  && {
    .ant-checkbox {
      order: 2;
      transform: scale(1.5);
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

const EditModal = ({ tripData, handleClickCancle }) => {
  const [form] = Form.useForm();
  console.log("tripData", tripData);
  const tripDataLocationIdArr = tripData.tripLocationList;
  // 모달

  const handleBackgroundClick = () => {
    handleClickCancle();
  };
  const handleModalClick = e => {
    e.stopPropagation();
  };
  // useState
  const [isLoadging, setIsLoadging] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [selectedLoca, setSelectedLoca] = useState([]); // tripData에서 초기화
  const [checkBox, setCheckBox] = useState([]);
  useEffect(() => {
    console.log("checkBox", checkBox);
  }, [checkBox]);
  useEffect(() => {
    console.log("selectedLoca", selectedLoca);
  }, [selectedLoca]);
  // API 여행 대분류 목록 불러오기
  const getLocation = async () => {
    const url = "/api/trip/location";
    setIsLoadging(true);
    try {
      const res = await axios.get(`${url}`);
      const resultData = res.data;
      setLocationList(resultData.data.locationList);
    } catch (error) {
      console.log("여행 대분류", error);
    } finally {
      setIsLoadging(false);
    }
  };

  const handleClickCate = location => {};

  const onFinish = values => {
    console.log(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      title: tripData.title,
      dates: [dayjs(tripData.startAt), dayjs(tripData.endAt)],
      member: [...tripData.tripUserIdList],
    });
    getLocation();
  }, [tripData]);
  useEffect(() => {
    setCheckBox([...tripData.tripUserIdList]);
    setSelectedLoca([...tripData.tripLocationList]);
  }, []);
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
            max-w-3xl w-full mx-auto h-screen
            flex items-center justify-center
            bg-[rgba(0,0,0,0.5)]"
      onClick={handleBackgroundClick}
    >
      {/* 모달 */}
      <div onClick={handleModalClick} className="bg-white p-5 w-2/3 rounded-lg">
        <h3 className="text-slate-700 text-xl font-semibold py-2">여행 수정</h3>
        <Spin spinning={isLoadging}>
          {/* 지역 선택 */}
          <div className="flex flex-col gap-1 pb-5">
            <h4 className="text-slate-700 text-lg">지역 선택</h4>
            <div className="flex flex-wrap gap-2">
              {locationList.map((item, index) => {
                return (
                  <button
                    type="button"
                    key={index}
                    className={`px-2 text-base rounded-xl border w-fit
                     ${selectedLoca.find(item => item.locationId === location.locationId)}
                      `}
                    onClick={() => {
                      handleClickCate(item);
                    }}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
          </div>
          {/* 폼 */}
          <section>
            <Form form={form} onFinish={onFinish} className="flex flex-col">
              <h4 className="text-slate-700 text-lg font-pretendard">
                여행 제목
              </h4>
              <Form.Item
                name="title"
                required
                rules={[
                  { required: true, message: "여행 제목을 입력해주세요" },
                ]}
              >
                <Input placeholder="여행 제목을 입력해주세요" />
              </Form.Item>
              <Form.Item
                name="dates"
                required
                rules={[
                  { required: true, message: "여행 기간을 입력해주세요" },
                ]}
              >
                <h4 className="text-slate-700 text-lg font-pretendard">
                  여행 기간
                </h4>
                <RangePicker
                  value={[dayjs(tripData.startAt), dayjs(tripData.endAt)]}
                />
              </Form.Item>
              <Form.Item
                name="member"
                required
                rules={[
                  { required: true, message: "1명 이상의 참여자는 필수입니다" },
                ]}
              >
                <h4 className="text-slate-700 text-lg font-pretendard">
                  여행 기간
                </h4>
                <Checkbox.Group className="flex flex-col gap-3">
                  {tripData?.tripUserIdList?.map((item, index) => (
                    <StyledCheckbox
                      key={index}
                      size="large"
                      checked={checkBox.includes(item)}
                    >
                      <p className="text-slate-600 font-pretendard text-base">
                        {item}
                      </p>
                    </StyledCheckbox>
                  )) || null}
                </Checkbox.Group>
              </Form.Item>
              <Form.Item>
                <div className="flex items-center gap-3">
                  <Button
                    className="w-full"
                    size="large"
                    onClick={handleClickCancle}
                  >
                    취소하기
                  </Button>
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="w-full"
                    size="large"
                  >
                    수정하기
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </section>
        </Spin>
      </div>
    </div>
  );
};

export default EditModal;
