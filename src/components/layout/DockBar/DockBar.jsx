import { Link } from "react-router-dom";

const DockBar = () => {
  return (
    <div className="flex max-w-3xl mx-auto justify-between items-center h-[60px] px-[30px] gap-10 bg-slate-400 fixed w-full bottom-0 ">
      <Link to="/search">검색</Link>
      <Link to="/schedule">일정</Link>
      <Link to="/">홈</Link>
      <Link to="/scheduleboard">여행기</Link>
      <Link to="/user">마이페이지</Link>
    </div>
  );
};
export default DockBar;
