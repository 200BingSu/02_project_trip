import { Tabs } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import WishList from "../../../components/user/WishList";
import "../../../styles/antd-styles.css";

const today = dayjs().format("YYYY-MM-DD");

const UserWishList = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(today);

  const onChange = key => {
    console.log(key);
  };

  return (
    <div>
      <TitleHeaderTs
        icon="back"
        onClick={() => {
          navigate(-1);
        }}
        title="찜 목록"
      />
      <div className="">
        {/* 필터 */}
        <div>
          {/* 카테고리 */}
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "전체",
                children: <WishList category="전체" />,
              },
              {
                key: "2",
                label: "관광지",
                children: <WishList category="관광지" />,
              },
              {
                key: "3",
                label: "숙소",
                children: <WishList category="숙소" />,
              },
              {
                key: "4",
                label: "맛집",
                children: <WishList category="맛집" />,
              },
              {
                key: "5",
                label: "축제",
                children: <WishList category="축제" />,
              },
            ]}
            onChange={onChange}
            className="custom-tab border-t-[10px] border-slate-100"
          />
        </div>
        {/* 검색 목록 */}
      </div>
    </div>
  );
};
export default UserWishList;
