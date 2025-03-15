import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const navigateToDetail = () => {
    navigate("/announcement/detail");
  };

  return (
    <ul className="px-4 py-4 flex flex-col gap-5">
      <li
        className="px-4 py-5 flex flex-col gap-2 border-b border-slate-200 cursor-pointer"
        onClick={navigateToDetail}
      >
        <h4 className="text-xl font-medium">공지 제목</h4>
        <p className="text-sm text-slate-500">2025-03-15</p>
      </li>
    </ul>
  );
};

export default Index;
