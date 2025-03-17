import { message, Modal } from "antd";
import React, { useState, useEffect, useRef } from "react";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";
import { IoLogoWechat, IoReaderOutline } from "react-icons/io5";
import { RiMapPinUserFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { LuMapPinned } from "react-icons/lu";
import { getCookie } from "../../../utils/cookie";
import { searchAtom } from "../../../atoms/searchAtom";
import { IoIosArrowUp } from "react-icons/io";
import { resetSearchData } from "../../../selectors/searchSelector";
import axios from "axios";
import { EventSourcePolyfill } from "event-source-polyfill";

const DockBar = React.memo(() => {
  //useLocation
  const location = useLocation();
  const nowLocation = location.pathname;
  // 채팅 구현 안되서 띄우는 모달창
  const [isModalOpen, setIsModalOpen] = useState(false);
  //쿠키
  const accessToken = getCookie("accessToken");
  //recoil
  const { userId } = useRecoilValue(userAtom);
  const [searchRecoil, setSearchRecoil] = useRecoilState(searchAtom);
  const resetSearch = useResetRecoilState(resetSearchData);
  //useNavigate
  const navigate = useNavigate();

  // 채팅 알림
  const chatEventRef = useRef(null);
  const EventSource = EventSourcePolyfill || NativeEventSource;
  const [chatAlert, setChatAlert] = useState(false);
  // 채팅 알림 받기
  // const getChatAlarm = () => {
  //   const url = "/api/chat-notice";
  //   chatEventRef.current = new EventSource(url, {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //       Connetction: "keep-alive",
  //       Accept: "text/event-stream",
  //       "Cache-Control": "no-cache",
  //     },
  //     withCredentials: true,
  //   });

  //   // 기본 메세지 이벤트
  //   chatEventRef.current.onmessage = event => {
  //     console.log("새로운 알림:", event.data);
  //   };

  //   // "exist unread notice" 이벤트 수신 (백엔드 이벤트 이름 따라 변경 필수)
  //   chatEventRef.current.addEventListener("exist unread notice", event => {
  //     console.log("안 읽은 알림 존재:", event.data);
  //     setChatAlert(true); // 새로운 알림이 있을 경우 UI 업데이트
  //   });

  //   chatEventRef.current.onerror = async () => {
  //     // e: Event
  //     chatEventRef.current?.close();
  //     // 재연결
  //     setTimeout(fetchSSE, 3000);
  //   };

  //   chatEventRef.current.onopen = () => {};
  // };
  // useEffect(() => {
  //   if (!accessToken) {
  //     return;
  //   }
  //   if (chatEventRef.current) {
  //     console.log("기존 SSE 연결 닫기");
  //     eventSourceRef.current.close();
  //   }
  //   getChatAlarm();
  //   return () => {
  //     chatEventRef.current?.close();
  //   };
  // }, [chatEventRef]);

  //antD
  const [messageApi, contextHolder] = message.useMessage();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const info = () => {
    console.log("info 작동");
    messageApi.open({
      type: "info",
      content: "로그인이 필요한 서비스입니다.",
      style: {
        marginTop: "20vh",
      },
    });
  };

  const showModal = () => {
    message.error("현재 지원되는 서비스가 아닙니다.");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex max-w-[768px] w-full h-auto fixed bottom-0 left-1/2 -translate-x-1/2 bg-white z-50 shadow-[0px_-4px_8px_0px_rgba(99,99,99,0.05)]">
        <Link
          to="/search/before"
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5"
        >
          <FiSearch className="text-2xl" />
          검색
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!accessToken) {
              info();
              message.error("로그인 후 이용 가능한 서비스 입니다");
            } else {
              navigate("/search/location");
            }
          }}
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5 text-sm"
        >
          <LuMapPinned className="text-2xl" />
          일정
        </button>
        <Link
          to="/"
          className="bg-primary text-white w-20 h-20 rounded-full flex flex-col justify-center items-center gap-1.5 relative bottom-5 text-sm"
          onClick={() => {
            resetSearch();
          }}
        >
          <BsFillPatchPlusFill className="text-2xl" />홈
        </Link>
        <Link
          to="/scheduleboard"
          className="text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5 text-sm"
        >
          <IoReaderOutline className="text-2xl" />
          여행기
        </Link>
        <button
          type="button"
          className="relative text-slate-400 flex flex-1 flex-col justify-center items-center gap-1.5 text-sm"
          onClick={() => {
            if (!accessToken) {
              info();
              message.error("로그인 후 이용 가능한 서비스 입니다");
            } else {
              navigate("/chat");
            }
          }}
        >
          <IoLogoWechat className="text-2xl" />
          채팅
          {chatAlert && (
            <div className="absolute top-3 right-1/3 w-2 h-2 bg-primary rounded-full"></div>
          )}
        </button>
        {nowLocation === "/search/strf" && (
          <div
            className={`absolute bottom-[120px] right-0 -translate-x-1/2 transition-all duration-300 ${
              showScrollButton ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <button
              type="button"
              className="bg-primary text-white rounded-full p-[10px] text-[24px] shadow-lg hover:bg-primary/90 transition-colors"
              onClick={scrollToTop}
            >
              <IoIosArrowUp />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default DockBar;
