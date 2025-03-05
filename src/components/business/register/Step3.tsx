import type { InputRef } from "antd";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Upload,
  UploadFile,
} from "antd";
import ImgCrop from "antd-img-crop";
import { valueType } from "antd/es/statistic/utils";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import { Imenu } from "../../../types/interface";
import { CategoryType } from "../../../types/enum";

interface optionType {
  label: string;
  value: string;
  disabled: boolean;
}

const Step3 = () => {
  // recoil
  const [register, setRegister] = useRecoilState(registerAtom);
  //useState
  const [menus, setMenus] = useState<Imenu[]>([]);
  const [items, setItems] = useState<optionType[]>([]);
  useEffect(() => {
    console.log(items);
  }, [items]);
  const [roomNumber, setRoomNumber] = useState<string>("");
  // 폼
  const [form] = Form.useForm();

  // 메뉴 추가
  const addMenu = (): void => {
    setMenus([
      ...menus,
      {
        // strfId: register.strfId,
        menuId: Date.now(),
        menuPic: [],
        name: "",
        price: 0,
        recomCapacity: 0,
        maxCapacity: 0,
        addPrice: 0,
        roomList: [],
      },
    ]);
    setRegister(prev => ({
      ...prev,
      menuList: [
        ...(prev.menuList || []),
        {
          menuId: Date.now(),
          // strfId: register.strfId,
          menuPic: [],
          name: "",
          price: 0,
          recomCapacity: 0,
          maxCapacity: 0,
          addPrice: 0,
          roomList: [],
        },
      ],
    }));
  };
  const handleImageChange = (file: any, id: any) => {
    const uploadFile: UploadFile = {
      uid: file.uid || `-${Date.now()}`,
      name: file.name,
      status: "done",
      url: URL.createObjectURL(file),
      originFileObj: file,
    };

    setMenus(prevMenus =>
      prevMenus.map(menu =>
        menu.menuId === id
          ? { ...menu, menuPic: [...(menu.menuPic || []), uploadFile] }
          : menu,
      ),
    );
    setRegister(prevRegister => ({
      ...prevRegister,
      menuList: prevRegister.menuList?.map(menu =>
        menu.menuId === id
          ? { ...menu, menuPic: [...(menu.menuPic || []), uploadFile] }
          : menu,
      ),
    }));
    return false;
  };
  // 객실 번호 추가
  const inputRef = useRef<InputRef>(null);
  const onRoomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomNumber(e.target.value);
  };
  const addItem = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (roomNumber.trim() !== "") {
      setItems([
        ...items,
        { label: roomNumber, value: roomNumber, disabled: false },
      ]);
      setRoomNumber("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  // 파일 업로드
  const [fileListMap, setFileListMap] = useState<Record<number, UploadFile[]>>(
    () => {
      const initialFileListMap: Record<number, UploadFile[]> = {};
      register.menuList?.forEach((menu, index) => {
        if (menu.menuPic && menu.menuPic.length > 0) {
          initialFileListMap[index] = menu.menuPic.map(item => ({
            uid: item.uid,
            name: item.name || "image.jpg",
            status: "done",
            url: item.originFileObj
              ? URL.createObjectURL(item.originFileObj)
              : "",
          }));
        }
      });
      return initialFileListMap;
    },
  );

  const onChange =
    (index: number) =>
    ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
      setFileListMap(prev => ({
        ...prev,
        [index]: newFileList,
      }));
    };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as Blob);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  // input 변경
  const handleChangeInput = (
    item: Imenu,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRegister(prev => ({
      ...prev,
      menuList: prev.menuList?.map(menu =>
        menu.menuId === item.menuId ? { ...menu, name: e.target.value } : menu,
      ),
    }));
  };
  // inputNum 변경
  const handleChangeInputNum = (
    item: Imenu,
    key: string,
    value: valueType | null,
  ) => {
    setRegister(prev => ({
      ...prev,
      menuList: prev.menuList?.map(menu =>
        menu.menuId === item.menuId ? { ...menu, [key]: value } : menu,
      ),
    }));
  };
  // select 변경
  const handleSelect = (item: Imenu, e: string[]) => {
    // 모든 방의 disabled 상태를 초기화
    const resetItems = items.map(room => ({
      ...room,
      disabled: false,
    }));

    // 다른 메뉴들이 선택한 방 번호들을 수집
    const selectedRooms =
      register.menuList?.reduce((acc: string[], menu) => {
        if (menu.menuId !== item.menuId && menu.roomList) {
          return [...acc, ...menu.roomList];
        }
        return acc;
      }, []) || [];

    // 선택된 방들의 disabled 상태를 true로 설정
    const updatedItems = resetItems.map(room => ({
      ...room,
      disabled: selectedRooms.includes(room.value),
    }));

    setItems(updatedItems);

    // 현재 메뉴의 roomList 업데이트
    setRegister(prev => ({
      ...prev,
      menuList: prev.menuList?.map(menu =>
        menu.menuId === item.menuId ? { ...menu, roomList: e } : menu,
      ),
    }));
  };

  useEffect(() => {
    return () => {
      // Cleanup created URLs
      Object.values(fileListMap).forEach(fileList => {
        fileList.forEach(file => {
          if (file.url && file.url.startsWith("blob:")) {
            URL.revokeObjectURL(file.url);
          }
        });
      });
    };
  }, [fileListMap]);

  useEffect(() => {
    if (register.menuList && register.menuList.length > 0) {
      const formValues = {
        menus: register.menuList.map(menu => ({
          name: menu.name,
          price: menu.price,
          addPrice: menu.addPrice,
          roomList: menu.roomList,
          menuPic: menu.menuPic,
          recomCapacity: menu.recomCapacity,
          maxCapacity: menu.maxCapacity,
        })),
      };
      form.setFieldsValue(formValues);
      setMenus(register.menuList);
    }
  }, [register.menuList]);

  const matchName = (category: string) => {
    if (category === CategoryType.HOTEL) {
      return "객실";
    } else {
      return "메뉴";
    }
  };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {/* 폼 */}
        <section className="flex flex-col gap-3">
          <ul className="flex flex-col gap-10 py-5">
            <li className="flex flex-col gap-1">
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i>{" "}
                {matchName(register.category || "")}를 추가해주세요
              </h3>
              <p className="text-base text-slate-500">
                최소 1개의 {matchName(register.category || "")}를 등록해주세요.
              </p>
              <div>
                <Form
                  form={form}
                  onFinish={values => {
                    // 이미지 포함 데이터 콘솔 출력
                    const finalData = values.menus.map(
                      (item: any, index: any) => ({
                        ...item,
                        menuPic: menus[index].menuPic, // 이미지 추가
                      }),
                    );
                    console.log("폼 제출 데이터:", finalData);
                  }}
                  layout="vertical"
                  className="flex flex-col gap-5"
                >
                  {register.menuList?.map((item, index) => (
                    <div
                      key={item.menuId}
                      className="border border-slate-300 rounded-lg p-5"
                    >
                      <Form.Item
                        label="이미지 업로드"
                        help={`${matchName(register.category || "")} 사진은 1장만 등록됩니다.`}
                        name={["menus", index, "menuPic"]}
                      >
                        <ImgCrop rotationSlider>
                          <Upload
                            listType="picture-card"
                            fileList={fileListMap[index] || []}
                            onChange={onChange(index)}
                            onPreview={onPreview}
                            beforeUpload={file =>
                              handleImageChange(file, item.menuId)
                            }
                            accept="image/*"
                            maxCount={1}
                          >
                            + Upload
                          </Upload>
                        </ImgCrop>
                      </Form.Item>
                      <Form.Item
                        name={["menus", index, "name"]}
                        label={
                          <p className="text-slate-700 text-sm">
                            {matchName(register.category || "")} 이름
                          </p>
                        }
                        rules={[
                          {
                            required: true,
                            message: `${matchName(register.category || "")} 이름을 입력해주세요.`,
                          },
                        ]}
                        className="w-1/2"
                      >
                        <Input
                          required
                          placeholder={`${matchName(register.category || "")} 이름을 입력해주세요. 예) ${register.category === CategoryType.HOTEL ? "트윈룸" : "피자"}`}
                          size="large"
                          value={item.name}
                          onChange={e => handleChangeInput(item, e)}
                        />
                      </Form.Item>
                      <Form.Item
                        name={["menus", index, "price"]}
                        label={
                          <p className="text-slate-700 text-sm">
                            {matchName(register.category || "")} 가격
                          </p>
                        }
                        rules={[
                          {
                            required: true,
                            message: `${matchName(register.category || "")} 가격을 입력해주세요.`,
                          },
                        ]}
                        className="w-1/2"
                      >
                        <InputNumber
                          required
                          controls={false}
                          formatter={value =>
                            value
                              ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              : ""
                          }
                          parser={value =>
                            value ? Number(value.replace(/\$\s?|(,*)/g, "")) : 0
                          }
                          suffix="원"
                          placeholder={`${matchName(register.category || "")} 가격을 입력해주세요. 예) 100000`}
                          size="large"
                          className="w-full"
                          value={item.price}
                          onChange={e => handleChangeInputNum(item, "price", e)}
                        />
                      </Form.Item>
                      {register.category === CategoryType.HOTEL && (
                        <>
                          <Form.Item
                            name={["menus", index, "roomList"]}
                            rules={[
                              {
                                required: true,
                                message: "객실 번호를 입력해주세요.",
                              },
                            ]}
                            label={
                              <p className="text-slate-700 text-sm">
                                객실 번호
                              </p>
                            }
                            help="* 다수의 객실 번호가 존재할 경우, 쉼표로 나열해주세요. "
                            className="w-1/2"
                          >
                            <Select
                              size="large"
                              placeholder="객실 번호를 입력해주세요"
                              mode="multiple"
                              allowClear
                              onChange={e => handleSelect(item, e)}
                              value={item.roomList}
                              options={items.map((roomNum: optionType) => ({
                                label: roomNum.label,
                                value: roomNum.value,
                                disabled: roomNum.disabled,
                              }))}
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
                                      value={roomNumber}
                                      onChange={onRoomNumberChange}
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
                            />
                          </Form.Item>
                          <Form.Item
                            name={["menus", index, "recomCapacity"]}
                            label={
                              <p className="text-slate-700 text-sm">
                                권장 인원
                              </p>
                            }
                            className="w-1/2"
                            rules={[
                              {
                                required: true,
                                message: "객실 권장 인원을 입력해주세요.",
                              },
                            ]}
                          >
                            <InputNumber
                              required
                              controls={false}
                              formatter={value => (value ? `${value}` : "")}
                              parser={value => (value ? Number(value) : 0)}
                              placeholder="권장 인원을 입력해주세요. 예) 2명"
                              suffix="명"
                              size="large"
                              className="w-full"
                              value={item.recomCapacity}
                              onChange={e =>
                                handleChangeInputNum(item, "recomCapacity", e)
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name={["menus", index, "maxCapacity"]}
                            label={
                              <p className="text-slate-700 text-sm">
                                최대 인원
                              </p>
                            }
                            className="w-1/2"
                            rules={[
                              {
                                required: true,
                                message: "객실 최대 인원을 입력해주세요.",
                              },
                            ]}
                          >
                            <InputNumber
                              required
                              controls={false}
                              formatter={value => (value ? `${value}` : "")}
                              parser={value => (value ? Number(value) : 0)}
                              placeholder="최대 인원을 입력해주세요. 예) 3명"
                              suffix="명"
                              size="large"
                              className="w-full"
                              value={item.maxCapacity}
                              onChange={e =>
                                handleChangeInputNum(item, "maxCapacity", e)
                              }
                            />
                          </Form.Item>
                          <Form.Item
                            name={["menus", index, "addPrice"]}
                            label={
                              <p className="text-slate-700 text-sm">
                                <i className="text-transparent">*</i> 추가 금액
                              </p>
                            }
                            help="* 지정된 인원 이상이 객실에 숙박할 경우, 추가되는 금액입니다. "
                            className="w-1/2"
                          >
                            <InputNumber
                              required
                              controls={false}
                              formatter={value =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              placeholder="추가 금액을 입력해주세요. 예) 50000"
                              suffix="원"
                              size="large"
                              className="w-full"
                              value={item.addPrice}
                              onChange={e =>
                                handleChangeInputNum(item, "addPrice", e)
                              }
                            />
                          </Form.Item>
                        </>
                      )}
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={addMenu}
                    size="large"
                    className="w-fit"
                  >
                    <AiOutlinePlus />
                    메뉴 추가
                  </Button>
                </Form>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Step3;
