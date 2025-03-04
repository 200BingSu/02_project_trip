import { Tabs } from "antd";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import "../../../styles/antd-styles.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LiaComment } from "react-icons/lia";
import AfterCoupon from "../../../components/coupon/AfterCoupon";
import BeforeCoupon from "../../../components/coupon/BeforeCoupon";
import Footer from "../../Footer";

const categoryArr = ["사용 가능한 쿠폰", "사용 / 만료 된 쿠폰"];

const UserCoupon = () => {
  const [category, setCategory] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="h-full">
      <TitleHeader icon="back" title="쿠폰함" onClick={() => navigate(-1)} />
      <div>
        <Tabs
          className="custom-tabs-nav custom-tabs-coupon"
          defaultActiveKey="1"
          items={[
            {
              label: "사용가능 쿠폰",
              key: "1",
              children: <BeforeCoupon />,
            },
            {
              label: "사용 / 만료 쿠폰",
              key: "2",
              children: <AfterCoupon />,
            },
          ]}
        />
      </div>
      <Footer />
    </div>
  );
};

export default UserCoupon;
