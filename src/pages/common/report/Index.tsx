import { Button, message, Radio, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReportType } from "../../../types/enum";
import { IAPI } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

const Index = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // router
  const navigate = useNavigate();
  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category"); // 리뷰, 상품, 여행기
  const reportTarget = searchParams.get("reportTarget"); // 대상
  //useState
  const [value, setValue] = useState(1);
  const [reason, setReason] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // antD
  const onChange = (e: any) => {
    setValue(e.target.value);
    if (e.target.value !== 8) {
      setText("");
    }
  };
  useEffect(() => {
    setReason(options.find(option => option.value === value)?.label || "");
  }, [value]);
  // API 신고
  const postReport = async (): Promise<IAPI<number> | null> => {
    const url = "/api/report";
    const payload = {
      category: transperCategory(category as string),
      reportTarget: reportTarget,
      reason: value === 8 ? text : reason,
    };
    setIsLoading(true);
    try {
      const res = await axios.post<IAPI<number>>(url, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const resultData = res.data;
      setIsLoading(false);
      if (resultData.code === "200 성공") {
        setTimeout(() => {
          message.success("신고가 완료되었습니다.");
        }, 0);
        navigate(-1);
      }
      return resultData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 405) {
          setTimeout(() => {
            message.error("이미 신고한 내용입니다.");
          }, 0);
        } else {
          setTimeout(() => {
            message.error("신고에 실패했습니다.");
          }, 0);
        }
      }
      setIsLoading(false);
      // console.log(error);
      return null;
    }
  };
  const options = [
    {
      value: 1,
      label: "주문과 관련없는 내용",
    },
    {
      value: 2,
      label: "음란성, 욕설 등 부적절한 내용",
    },
    {
      value: 3,
      label: "부적절한 홍보 또는 광고",
    },
    {
      value: 4,
      label: "관련없는 사진 게시",
    },
    {
      value: 5,
      label: "개인정보 유출 위험",
    },
    {
      value: 6,
      label: "리뷰 작성 취지에 맞지 않는 내용(복사글 등)",
    },
    {
      value: 7,
      label: "저작권 도용 의심(사진 등)",
    },
    {
      value: 8,
      label: "기타(하단 내용 작성)",
    },
  ];

  const transperCategory = (category: string) => {
    switch (category) {
      case ReportType.REVIEW:
        return "리뷰";
      case ReportType.STRF:
        return "상품";
      case ReportType.TRIPREVIEW:
        return "여행기";
      default:
        return "리뷰";
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4 text-slate-700 px-4">
        <h2 className="text-2xl font-bold">신고하는 이유를 알려주세요!</h2>
        <div className="flex flex-col bg-slate-100 rounded-lg p-4 text-slate-500 text-sm">
          <p>
            타당한 근거 없이 신고된 내용은 관리자 확인 후 반영되지 않을 수
            있습니다.
          </p>
          <p>신고하는 이유를 알려주시면 더 나은 서비스를 제공할 수 있습니다.</p>
        </div>
      </section>
      <Spin spinning={isLoading}>
        <section className="px-4 flex flex-col gap-4">
          <Radio.Group
            options={options}
            onChange={onChange}
            value={value}
            className="flex flex-col gap-4 w-full [&_.ant-radio-wrapper]:text-base [&_.ant-radio-wrapper]:text-slate-700"
          />
          <TextArea
            placeholder="신고 사유를 입력해주세요."
            showCount
            maxLength={500}
            onChange={e => setText(e.target.value)}
            value={text}
            disabled={value !== 8}
            style={{ resize: "none", height: "180px" }}
          />
        </section>
        <section className="px-4 py-8">
          <Button
            type="primary"
            className="w-full h-[16vw] max-h-[60px] text-lg font-semibold"
            onClick={postReport}
          >
            신고하기
          </Button>
        </section>
      </Spin>
    </div>
  );
};

export default Index;
