import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  InputRef,
  message,
  Select,
  Space,
  Spin,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { ChangeEvent, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { IAPI } from "../../../types/interface";
import axios from "axios";
import { getCookie } from "../../../utils/cookie";
import { useNavigate, useSearchParams } from "react-router-dom";
import { categoryKor } from "../../../utils/match";
import { amenities } from "../../../constants/dataArr";

export interface ParlorType {
  maxCapacity: number;
  recomCapacity: number;
  surcharge: number;
  menuId: number;
}
export interface CreateRoomDataType {
  strfId: number;
  busiNum: string;
  category: string;
  menuId: number;
  ameniPoints: number[];
  parlors: ParlorType[];
  rooms: number[];
}
interface CreateRoomResponseType {}

interface RoomFormProps {
  menuId: string | null;
}

const RoomForm = ({ menuId }: RoomFormProps) => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const busiNum = userInfo?.strfDtos[0].busiNum;
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = Number(searchParams.get("strfId"));
  const category = searchParams.get("category");
  const navigate = useNavigate();
  const [form] = useForm();
  const inputRef = useRef<InputRef>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);

  // antD selector
  const [items, setItems] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const addItem = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setItems([...items, name || `없음`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  // API 객실 생성
  const createRoom = async (
    data: CreateRoomDataType,
  ): Promise<IAPI<CreateRoomResponseType> | null> => {
    setIsLoading(true);
    const url = "/api/detail/stay";
    try {
      const res = await axios.post<IAPI<CreateRoomResponseType>>(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setIsLoading(false);
        message.success("객실 생성 완료");
        navigate(`/business/menu?strfId=${strfId}&category=${category}`);
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      return null;
    }
  };
  // 편의 시설 클릭
  const handleAmenityClick = (amenityId: number) => {
    if (selectedAmenities.includes(amenityId)) {
      setSelectedAmenities(prev => prev.filter(id => id !== amenityId));
    } else {
      setSelectedAmenities(prev => [...prev, amenityId]);
    }
  };
  // 폼 제출
  const onFinish = (values: any) => {
    const { recomCapacity, maxCapacity, surcharge, rooms } = values;
    const sendData: CreateRoomDataType = {
      strfId: strfId,
      busiNum: busiNum,
      category: categoryKor(category) as string,
      menuId: Number(menuId),
      ameniPoints: selectedAmenities,
      parlors: [
        {
          menuId: Number(menuId),
          recomCapacity: recomCapacity,
          maxCapacity: maxCapacity,
          surcharge: surcharge,
        },
      ],
      rooms: rooms,
    };
    console.log(sendData);
    createRoom(sendData);
  };
  return (
    <div className="px-4 py-3">
      <Spin spinning={isLoading}>
        <Form form={form} onFinish={onFinish} name="room/parlors/amenities">
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">객실 번호</h3>
            <p className="text-sm text-slate-500">
              해당 객실 종류에 해당하는 객실 번호를 입력해주세요.
            </p>
          </div>
          <Form.Item
            name={"rooms"}
            rules={[
              {
                required: true,
                message: "객실 번호를 입력해주세요.",
              },
            ]}
            help="객실 번호를 추가하신 뒤, 해당되는 객실 번호를 선택해주세요."
            className="w-full pb-5"
          >
            <Select
              size="large"
              placeholder="객실 번호를 입력해주세요"
              mode="multiple"
              allowClear
              dropdownRender={menu => (
                <>
                  {menu}
                  <Divider
                    style={{
                      margin: "8px 0",
                    }}
                  />
                  <Space
                    style={{
                      padding: "0 8px 4px",
                    }}
                  >
                    <Input
                      placeholder="객실 번호"
                      ref={inputRef}
                      value={name}
                      onChange={onNameChange}
                      onKeyDown={e => e.stopPropagation()}
                      onPressEnter={addItem}
                    />
                    <Button
                      type="text"
                      icon={<AiOutlinePlus />}
                      onClick={addItem}
                    >
                      추가
                    </Button>
                  </Space>
                </>
              )}
              options={items.map(item => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Item>
          <div className="py-2 flex flex-col gap-1">
            <h3 className="text-slate-700 text-lg font-semibold">객실 인원</h3>
            <p className="text-sm text-slate-500">
              해당 객실 종류의 권장 인원 및 최대 인원과 그에 따른 추가금액을
              <br />
              입력해주세요.
            </p>
          </div>
          <Form.Item
            name={"recomCapacity"}
            rules={[
              {
                required: true,
                message: "권장 인원을 입력해주세요.",
              },
            ]}
            label="권장 인원"
            labelCol={{ span: 30 }}
            className="w-full"
          >
            <InputNumber
              size="large"
              placeholder="권장 인원"
              className="w-3/4"
              suffix="명"
              onChange={value => form.setFieldsValue({ maxCapacity: value })}
            />
          </Form.Item>
          <Form.Item
            name={"maxCapacity"}
            rules={[
              {
                required: true,
                message: "최대 인원을 입력해주세요.",
              },
            ]}
            label="최대 인원"
            labelCol={{ span: 30 }}
            className="w-full"
          >
            <InputNumber
              size="large"
              placeholder="최대 인원"
              className="w-3/4"
              suffix="명"
            />
          </Form.Item>
          <Form.Item
            name={"surcharge"}
            rules={[
              {
                required: true,
                message: "추가 금액을 입력해주세요.",
              },
            ]}
            label="추가 금액"
            labelCol={{ span: 30 }}
            className="w-full pb-5"
          >
            <InputNumber
              size="large"
              placeholder="추가 금액"
              className="w-3/4"
              suffix="원"
              formatter={value =>
                value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
              }
            />
          </Form.Item>
          <div className="py-2 flex flex-col gap-1 pb-10">
            <h3 className="text-slate-700 text-lg font-semibold">편의 시설</h3>
            <p className="text-sm text-slate-500 pb-2">
              해당 객실 종류의 편의 시설을 선택해주세요.
              <br /> * 해당 편의시설은 검색 필터에 적용됩니다.
            </p>
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
          </div>
          <Form.Item className="w-full flex justify-end">
            <Button type="primary" htmlType="submit" size="large">
              등록하기
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default RoomForm;
