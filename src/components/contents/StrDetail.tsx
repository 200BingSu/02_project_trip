import { Button } from "antd";
import ContentsMap from "./ContentsMap";
import { StrInfoProps } from "./StrInfo";
import { useEffect, useRef, useState } from "react";

const StrDetail = ({ contentData }: StrInfoProps): JSX.Element => {
  const [openDetail, setOpenDetail] = useState(false);
  const [isLongText, setIsLongText] = useState(false);
  // ref의 타입을 HTMLDivElement로 명시
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsLongText(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [contentData?.detail]);

  return (
    <div>
      <section className="my-6 px-4">
        <h3 className="font-semibold text-slate-700 text-xl mb-4">소개</h3>
        <div className="relative w-full">
          <p
            ref={textRef}
            className={`text-base text-slate-500 ${openDetail ? "" : "line-clamp-5"}`}
          >
            {contentData?.detail}
          </p>
          {isLongText && !openDetail && (
            <div className="absolute inset-0 bg-gradient-to-t from-white/100 to-white/0"></div>
          )}
        </div>
        {isLongText && (
          <Button
            onClick={() => setOpenDetail(prev => !prev)}
            className="w-full h-auto py-[14px] border border-slate-300 rounded-lg"
          >
            {openDetail ? "숨기기" : "펼치기"}
          </Button>
        )}
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section className="my-6 px-4">
        <h3 className="font-semibold text-slate-700 text-xl mb-4">위치</h3>
        <ContentsMap contentData={contentData} />
        <div>
          <dl className="mt-4 px-4 py-6 bg-slate-50 rounded-lg">
            <dt className="text-base text-slate-700 font-semibold float-left mr-3">
              주소
            </dt>
            <dd className="text-base text-slate-500 mb-1">
              ({contentData?.post}) {contentData?.address}
            </dd>
            <dt className="text-base text-slate-700 font-semibold float-left mr-3">
              전화
            </dt>
            <dd className="text-base text-slate-500 mb-1">062-610-7000</dd>
            <dt className="text-base text-slate-700 font-semibold float-left mr-3">
              사업자번호
            </dt>
            <dd className="text-base text-slate-500">410-86-60209</dd>
          </dl>
        </div>
      </section>
    </div>
  );
};

export default StrDetail;
