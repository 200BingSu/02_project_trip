import { Collapse } from "antd";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { qnaData } from "../../../constants/qnaData";
import { getCookie } from "../../../utils/cookie";
import { ROLE } from "../../../types/enum";

const QnA = () => {
  // 쿠키
  const userInfo = getCookie("user");
  const role = userInfo.role[0];
  // router
  const navigate = useNavigate();
  const navigateToBack = () => {
    console.log("role", role);
    if (role === ROLE.USER) {
      navigate("/");
    }
    if (role === ROLE.BUSI) {
      navigate("/business");
    }
  };
  const onChange = (key: string[]) => {
    console.log(key);
  };
  return (
    <div className="max-w-[768px] mx-auto">
      <TitleHeaderTs
        title="자주 묻는 질문"
        icon="close"
        onClick={() => navigateToBack()}
      />
      <section className="w-full  px-4">
        <Collapse
          defaultActiveKey={["1"]}
          onChange={onChange}
          expandIconPosition="end"
          items={qnaData}
          bordered={false}
          style={{
            background: "white",
            borderRadius: 0,
            width: "100%",
          }}
          className="w-full [&_.ant-collapse-content-box]:bg-slate-100"
        />
      </section>
    </div>
  );
};

export default QnA;
