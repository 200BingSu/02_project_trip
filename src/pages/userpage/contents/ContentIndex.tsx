import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import Amenities from "../../../components/contents/Amenities";
import Parlor from "../../../components/contents/Parlor";
import Reviews from "../../../components/contents/Reviews";
import StrDetail from "../../../components/contents/StrDetail";
import StrInfo from "../../../components/contents/StrInfo";
import ContentsHeader from "../../../components/layout/header/ContentsHeader";
import "../../../styles/antd-styles.css";
import { useEffect, useState } from "react";
import { IStrf } from "../../../types/interface";
import jwtAxios from "../../../apis/jwt";

const ContentIndex = (): JSX.Element => {
  const [contentData, setContentData] = useState<IStrf | null>(null);
  const [searchParams] = useSearchParams();
  const strfId = parseInt(searchParams.get("strfId") || "0");

  const getDetailMember = async () => {
    try {
      const res = await jwtAxios.get(`/api/detail/member?&strf_id=${strfId}`);
      res.data.data;
      console.log("상품조회-회원", res.data.data);
      setContentData(res.data.data);
    } catch (error) {
      console.log("상품조회-회원", error);
    }
  };

  useEffect(() => {
    getDetailMember();
  }, []);

  return (
    <div>
      <ContentsHeader />
      <section>
        {contentData && <StrInfo strfId={strfId} contentData={contentData} />}
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section>
        <Parlor strfId={strfId} />
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section>
        <Amenities strfId={strfId} />
      </section>
      <section className="w-full h-[10px] bg-slate-100" />
      <section>
        <Tabs
          defaultActiveKey="1"
          centered
          className="custom-strf-tabs"
          items={[
            {
              label: "상세정보",
              key: "1",
              children: (
                <>
                  {contentData && (
                    <StrDetail strfId={strfId} contentData={contentData} />
                  )}
                </>
              ),
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
