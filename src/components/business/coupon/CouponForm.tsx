import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Spin,
} from "antd";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { ICoupon } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { RangePicker } = DatePicker;

interface CouponFormProps {
  formType: string;
  couponId: number;
  strfId: number;
  couponData?: ICoupon;
}

const CouponForm = ({
  formType,
  couponId,
  strfId,
  couponData,
}: CouponFormProps) => {
  const title = formType === "edit" ? "쿠폰 수정" : "쿠폰 등록";
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const navigateToCouponList = () => {
    navigate(`/business/coupon?strfId=${strfId}`);
  };
  // 쿠키
  const accessToken = getCookie("accessToken");
  // API 사업자 쿠폰 발급
  const postCreateCoupon = async (data: ICoupon) => {
    setIsLoading(true);
    const url = "/api/coupon/business/issuance";
    try {
      const res = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("쿠폰 등록", res.data);
      if (res.data) {
        setIsLoading(false);
        message.success("쿠폰 등록 성공");
        navigateToCouponList();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  //   API 사업자 쿠폰 수정
  const patchCoupon = async (data: ICoupon) => {
    setIsLoading(true);
    const url = "/api/coupon/business/issuance";
    console.log("제출 데이터", data);
    try {
      const res = await axios.patch(url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("쿠폰 수정", res.data);
      if (res.data) {
        setIsLoading(false);
        message.success("쿠폰 수정 성공");
        navigateToCouponList();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  // 날짜 비활성화
  const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  const disabledDate = (current: dayjs.Dayjs) => {
    // 오늘 이전 날짜만 비활성화
    return current && current < dayjs().startOf("day");
  };

  // 날짜 포멧
  // const formatDate = (date: dayjs.Dayjs[]) => {
  //   return date?.map(item => dayjs(item).format("YYYY-MM-DD"));
  // };
  // 폼 제출
  const onFinish = (values: any) => {
    const { title, date, discountPer } = values;
    // const formattedDate = formatDate(date);
    const couponData = {
      title,
      distributeAt: dayjs(date[0]).format("YYYY-MM-DDTHH:mm:ss"),
      expiredAt: dayjs(date[1]).format("YYYY-MM-DDTHH:mm:ss"),
      discountPer: Number(discountPer),
    };
    if (formType === "edit") {
      const patchData = { ...couponData, couponId };
      patchCoupon(patchData);
    } else {
      const createData = { ...couponData, strfId };
      postCreateCoupon(createData);
    }
  };

  useEffect(() => {
    if (couponData) {
      form.setFieldsValue({
        title: couponData.title,
        date: [dayjs(couponData.distributeAt), dayjs(couponData.expiredAt)],
        discountPer: couponData.discountPer,
      });
    }
  }, [couponData, form]);

  return (
    <div className="flex flex-col gap-2 pt-2 pb-5">
      <div className="px-4">
        <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
      </div>
      {/* 입력 폼 */}
      <Spin spinning={isLoading}>
        <div className="flex flex-col gap-5 pb-8">
          <Form form={form} onFinish={onFinish} className="w-full">
            <div className="px-4 py-3">
              <h3 className="text-lg font-semibold text-slate-700">
                쿠폰 관리명
              </h3>
              <p className="text-base font-medium text-slate-500">
                고객에게 노출되는 쿠폰 이름입니다.
              </p>
              <Form.Item
                name="title"
                required
                rules={[
                  { required: true, message: "쿠폰 이름을 입력해주세요." },
                ]}
              >
                <Input placeholder="쿠폰 이름을 입력해주세요." size="large" />
              </Form.Item>
            </div>
            <div className="px-4 py-3">
              <h3 className="text-lg font-semibold text-slate-700">
                쿠폰 유효기간
              </h3>
              <p className="text-base font-medium text-slate-500">
                쿠폰 유효기간을 입력해주세요.
              </p>
              <Form.Item
                name="date"
                required
                rules={[
                  { required: true, message: "쿠폰 유효기간을 입력해주세요." },
                ]}
              >
                <RangePicker
                  disabledDate={disabledDate}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder={["시작일", "종료일"]}
                />
              </Form.Item>
            </div>
            <div className="px-4 py-3">
              <h3 className="text-lg font-semibold text-slate-700">
                쿠폰 할인율
              </h3>
              <p className="text-base font-medium text-slate-500">
                쿠폰 할인율을 입력해주세요.
              </p>
              <Form.Item
                name="discountPer"
                required
                rules={[
                  { required: true, message: "쿠폰 할인율을 입력해주세요." },
                ]}
              >
                <InputNumber
                  placeholder="쿠폰 할인율을 입력해주세요."
                  size="large"
                  min={0}
                  max={100}
                  className="w-72"
                  suffix="%"
                />
              </Form.Item>
            </div>
            <Form.Item className="px-4 py-3 flex justify-end">
              <div className="flex gap-3">
                <Button type="default" size="large">
                  취소
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  등록
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Spin>
    </div>
  );
};

export default CouponForm;
