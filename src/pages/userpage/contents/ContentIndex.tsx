import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import Amenities from "../../../components/contents/Amenities";
import Parlor from "../../../components/contents/Parlor";
import Reviews from "../../../components/contents/Reviews";
import StrDetail from "../../../components/contents/StrDetail";
import StrInfo from "../../../components/contents/StrInfo";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

const ContentIndex = () => {
  const [searchParams] = useSearchParams();
  const strfId = parseInt(searchParams.get("strfId") || "0");

  return (
    <div>
      <TitleHeaderTs icon="back" title="홀리데이 인 광주 호텔" />
      <section>
        <StrInfo strfId={strfId} />
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section>
        <Parlor />
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section>
        <Amenities />
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: "상세정보",
              key: "1",
              children: <StrDetail />,
            },
            {
              label: "리뷰",
              key: "2",
              children: <Reviews />,
            },
          ]}
        />
      </section>
    </div>
  );
};

export default ContentIndex;
