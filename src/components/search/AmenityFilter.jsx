import { Button, Checkbox, Form } from "antd";
import { amenities } from "../../constants/dataArr";
import React, { useCallback } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { searchAtom } from "../../atoms/searchAtom";

const AmenityFilter = ({
  handleClickCancle,
  getAmenitySearch,
  setAmenityValues,
  searchData,
  setSearchData,
}) => {
  const [form] = Form.useForm();
  //useState
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  // 모달이 마운트될 때 body에 overflow: hidden 추가
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  //모달
  const handleBackgroundClick = () => {
    handleClickCancle();
  };

  const handleModalClick = e => {
    e.stopPropagation();
  };

  // 편의시설 필터 적용 함수 수정
  const handleFinish = async values => {
    console.log("values", values.amenities);
    setAmenityValues(values.amenities);
    const amenityIds = values.amenities
      ?.map(id => `amenity_id=${id}`)
      .join("&");
    console.log("amenityIds", amenityIds);
    await getAmenitySearch(amenityIds);
    handleClickCancle();
  };
  return (
    <div
      className="fixed top-0 left-[50%] translate-x-[-50%] z-10
            max-w-3xl w-full mx-auto h-screen
            flex items-end justify-center
            bg-[rgba(0,0,0,0.5)] overflow-hidden"
      onClick={() => {
        handleBackgroundClick();
      }}
    >
      {/* 모달창 */}
      <div
        className="bg-white w-full 
                px-[60px] py-[55px]
                flex flex-col gap-[20px]
                mb-[60px]
                "
        onClick={handleModalClick}
      >
        {/* 모달 내용 */}
        <Form
          form={form}
          onFinish={handleFinish}
          className="h-[500px] flex flex-col"
        >
          <Form.Item
            name="amenities"
            className="flex-1 px-3 py-2 rounded-lg cursor-pointer overflow-y-auto"
          >
            <Checkbox.Group className="flex flex-col gap-4 px-5 pt-4 w-full">
              {amenities.map((item, index) => {
                return (
                  <Checkbox
                    value={item.amenity_id}
                    key={index}
                    className="scale-110 !flex items-center"
                  >
                    <div className="flex items-center gap-2 ml-2">
                      <span className="text-[16px] text-slate-500">
                        {item.icon}
                      </span>
                      <span className="text-[20px] text-slate-700">
                        {item.key}
                      </span>
                    </div>
                  </Checkbox>
                );
              })}
            </Checkbox.Group>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end gap-4">
              <Button
                color="default"
                variant="filled"
                onClick={handleClickCancle}
                className="h-[40px] font-semibold text-[20px] text-slate-500"
              >
                취소
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="h-[40px] font-semibold text-[20px]"
              >
                적용
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AmenityFilter;
