import { Collapse } from "antd";
import { useNavigate } from "react-router-dom";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { qnaData } from "../../../constants/qnaData";

const QnA = () => {
  // router
  const navigate = useNavigate();

  const onChange = (key: string[]) => {
    console.log(key);
  };
  return (
    <div>
      <TitleHeaderTs
        title="자주 묻는 질문"
        icon="close"
        onClick={() => navigate("/business")}
      />
      <section className="px-4 py-4 flex flex-col gap-4">
        <Collapse
          defaultActiveKey={["1"]}
          onChange={onChange}
          expandIconPosition="right"
          items={qnaData}
          bordered={false}
          style={{
            background: "white",
            borderRadius: 0,
          }}
          className="[&_.ant-collapse-content-box]:bg-slate-100"
        />
      </section>
    </div>
  );
};

export default QnA;
