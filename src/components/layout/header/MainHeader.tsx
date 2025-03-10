import { BiBell } from "react-icons/bi";
import { CgMenuGridO } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../utils/cookie";

interface MainHeaderProps {
  onClick: () => void;
}

const MainHeader = ({ onClick }: MainHeaderProps) => {
  // 쿠키
  const accessToken = getCookie("accessToken");

  // useNavigate
  const navigate = useNavigate();

  return (
    <header
      className={`select-none flex h-auto items-center px-4 py-3 max-w-3xl w-full sticky top-0 left-0 z-10 duration-300 ${scrollY ? "shadow-sm" : "shadow-none"} z-50 bg-white `}
    >
      <h1 className="w-[32vw] max-w-32 mr-auto">
        <img
          src="/images/logo_1.png"
          alt="main_logo"
          className="cursor-pointer"
          onClick={() => {
            navigate("/");
          }}
        />
      </h1>
      <nav className=" flex gap-5">
        <BiBell className="text-2xl text-slate-400 cursor-pointer" />
        <CgMenuGridO
          className="text-2xl text-slate-400 cursor-pointer"
          onClick={() => {
            if (accessToken) {
              onClick();
            } else {
              navigate("/signin");
            }
          }}
        />
      </nav>
    </header>
  );
};
export default MainHeader;
