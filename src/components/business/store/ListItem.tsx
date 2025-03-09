import { Input, Select, Spin } from "antd";
import { memo, ReactNode, useEffect, useState } from "react";
import { BiSolidEditAlt } from "react-icons/bi";
import { koreaAreaCodes } from "../../../constants/koreaAreaCode";
import TextArea from "antd/es/input/TextArea";
import { amenities } from "../../../constants/dataArr";

interface ListItemProps {
  children?: ReactNode;
  title: string | ReactNode;
  content: string | ReactNode;
  type: string;
}
const ListItem = ({ title, content, type }: ListItemProps): JSX.Element => {
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading] = useState(false);
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
  const handleClickButton = () => {
    setIsEdit(!isEdit);
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
  useEffect(() => {
    if (type === "tell" && typeof content === "string") {
      const tellNum = content ? content.split("-") : ["000", "0000", "0000"];
      // console.log(tellNum);
      setAreaCode(tellNum[0]);
      setValue(`${tellNum[1]}-${tellNum[2]}`);
    }
    if (type === "detail" && typeof content === "string") {
      setValue(content);
    }
  }, [content, type]);
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
            {content}
          </div>
        )}
        {isEdit && type === "state" && (
          <Select
            defaultValue={content}
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
            defaultValue={value}
            placeholder="전화번호를 입력해주세요."
            onChange={e => setValue(e.target.value)}
            value={formatPhoneNumber(value ?? "0")}
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
      </Spin>
    </section>
  );
};

export default memo(ListItem);
