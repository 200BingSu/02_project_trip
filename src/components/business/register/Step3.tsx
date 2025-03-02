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
import React, { useRef, useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import ImgCrop from "antd-img-crop";
import type { InputRef } from "antd";

const Step3 = () => {
  // recoil
  const [register, setRegister] = useRecoilState(registerAtom);
  //useState
  const [items, setItems] = useState<string[]>([]);
  const [roomNumber, setRoomNumber] = useState<string>("");
  // 폼
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
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
      setItems([...items, roomNumber]);
      setRoomNumber("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  // 파일 업로드
  const [fileListMap, setFileListMap] = useState<Record<number, UploadFile[]>>(
    {},
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

  // 컴포넌트 마운트 시 초기 필드 추가
  useEffect(() => {
    form.setFieldsValue({
      menuList: [""], // 빈 필드 하나로 시작
    });
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold text-slate-600">
          업체의 정보를 작성해주세요(3/3)
        </h2>
        {/* 폼 */}
        <section className="flex flex-col gap-3">
          <ul className="flex flex-col gap-10 py-5">
            <li className="flex flex-col gap-1">
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 메뉴를 추가해주세요
              </h3>
              <p className="text-base text-slate-500">
                최소 1개의 메뉴를 등록해주세요.
              </p>

              <Form
                onFinish={onFinish}
                form={form}
                initialValues={{ menuList: [""] }}
              >
                <Form.List name="menuList">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ name, key }, index) => (
                        <div key={key} className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="w-[32px] h-[32px] flex items-center justify-center border border-slate-300 rounded-full transition-all duration-300
                            hover:border-primary hover:text-primary"
                          >
                            <AiOutlineMinus />
                          </button>
                          <div className="w-full">
                            <Form.Item
                              name={`menu_pic-${name}`}
                              rules={[
                                {
                                  required: true,
                                  message: "메뉴 사진을 입력해주세요.",
                                },
                              ]}
                              className="w-full"
                              help="메뉴 사진은 1장만 등록해주세요."
                            >
                              <ImgCrop rotationSlider>
                                <Upload
                                  listType="picture-card"
                                  fileList={fileListMap[index] || []}
                                  onChange={onChange(index)}
                                  onPreview={onPreview}
                                  beforeUpload={() => false}
                                  accept="image/*"
                                  maxCount={1}
                                >
                                  + Upload
                                </Upload>
                              </ImgCrop>
                            </Form.Item>
                            <Form.Item
                              name={name}
                              rules={[
                                {
                                  required: true,
                                  message: "메뉴 이름을 입력해주세요.",
                                },
                              ]}
                              label={
                                <p className="text-slate-700 text-sm">
                                  메뉴 이름
                                </p>
                              }
                              className="w-full"
                            >
                              <Input
                                required
                                placeholder="메뉴 이름을 입력해주세요. 예) 트윈룸"
                                size="large"
                              />
                            </Form.Item>
                            <Form.Item
                              name={`price-${name}`}
                              rules={[
                                {
                                  required: true,
                                  message: "메뉴 가격을 입력해주세요.",
                                },
                              ]}
                              label={
                                <p className="text-slate-700 text-sm">
                                  메뉴 가격
                                </p>
                              }
                              className="w-full"
                            >
                              <InputNumber
                                required
                                controls={false}
                                formatter={value =>
                                  `${value}원`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",",
                                  )
                                }
                                placeholder="메뉴 가격을 입력해주세요. 예) 100000"
                                size="large"
                                className="w-full"
                                defaultValue={0}
                              />
                            </Form.Item>
                            {register.category === "숙소" && (
                              <>
                                <Form.Item
                                  name={`addPrice-${name}`}
                                  label={
                                    <p className="text-slate-700 text-sm">
                                      <i className="text-transparent">*</i> 추가
                                      금액
                                    </p>
                                  }
                                  help="* 지정된 인원 이상이 객실에 숙박할 경우, 추가되는 금액입니다. "
                                  className="w-full"
                                >
                                  <InputNumber
                                    required
                                    controls={false}
                                    formatter={value =>
                                      `${value}원`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ",",
                                      )
                                    }
                                    placeholder="추가 금액을 입력해주세요. 예) 50000"
                                    size="large"
                                    className="w-full"
                                    defaultValue={0}
                                  />
                                </Form.Item>
                                <Form.Item
                                  name={`roomList-${name}`}
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
                                  className="w-full"
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
                                    options={items.map(item => ({
                                      label: item,
                                      value: item,
                                    }))}
                                  />
                                </Form.Item>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                      <Button
                        type="primary"
                        onClick={() => add()}
                        className="w-fit flex gap-[5px] items-center"
                        size="large"
                      >
                        <i>
                          <AiOutlinePlus />
                        </i>
                        메뉴 추가
                      </Button>
                    </>
                  )}
                </Form.List>
              </Form>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Step3;
