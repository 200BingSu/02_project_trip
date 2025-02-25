import { AiOutlineInstagram } from "react-icons/ai";
import { BiLogoFacebook } from "react-icons/bi";
import { BsGooglePlay } from "react-icons/bs";
import { Link } from "react-router-dom";
import DockBar from "../components/layout/DockBar/DockBar";

const Footer = () => {
  return (
    <div className="h-full w-full pb-40">
      <footer className="relative pt-10 bg-white  before:absolute before:top-0 before:w-full before:h-2.5 before:bg-slate-100 before:inline-block ">
        <div className="flex flex-wrap gap-3 text-base font-semibold text-slate-600 mb-5 px-4">
          <Link to="">이용약관</Link>
          <span className="text-slate-300 font-light">|</span>
          <Link to="">개인정보처리방침</Link>
          <span className="text-slate-300 font-light">|</span>
          <Link to="">서비스 이용약관</Link>
          <span className="text-slate-300 font-light">|</span>
          <Link to="">위치서비스 이용약관</Link>
        </div>
        <div className="mt-5 px-4">
          <div className="flex items-center justify-between ">
            <h4 className="text-base font-semibold text-slate-600">
              (주) 쿼드러플
            </h4>
            <div className="flex gap-3">
              <Link
                to=""
                className="flex justify-center items-center w-8 h-8 rounded-full border border-slate-300"
              >
                <BiLogoFacebook className="text-slate-400 text-base" />
              </Link>
              <Link
                to=""
                className="flex justify-center items-center w-8 h-8 rounded-full border border-slate-300"
              >
                <AiOutlineInstagram className="text-slate-400 text-base" />
              </Link>
              <Link
                to=""
                className="flex justify-center items-center w-8 h-8 rounded-full border border-slate-300"
              >
                <BsGooglePlay className="text-slate-400 text-sm" />
              </Link>
            </div>
          </div>
          <div className="text-sm text-slate-400 font-light  mt-5">
            <p>서울특별시 강남구 테헤란로 123, 45층</p>
            <p>사업자 등록번호 123-45-67890</p>
            <p>통신판매업 신고번호: 2025-서울강남-01234</p>
            <p>이메일: support@quadruple.app</p>
          </div>
          <div className="text-xs font-light text-slate-400 mt-3">
            <p>여행지 및 콘텐츠 정보는 공공데이터를 기반으로 제작되었습니다.</p>
            <p>© 2025 쿼드러플. All rights reserved.</p>
          </div>
          <img
            src="/images/logo_2.png"
            alt="footer-main-logo"
            className="w-28 mt-5"
          />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
