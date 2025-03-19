import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ROLE } from "../../types/enum";
import { getCookie } from "../../utils/cookie";
import CenterModalTs from "../common/CenterModalTs";
import { AiFillWechat } from "react-icons/ai";
import { moveTop } from "../../utils/moveTo";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";

const BusinessLayout = () => {
  //쿠키
  const accessToken = getCookie("accessToken");
  //navigate
  const navigate = useNavigate();
  const navigateToLogin = () => {
    navigate("/signin");
  };
  const navigateToChat = () => {
    navigate("/chat?type=business");
  };
  // location
  const location = useLocation();
  const pathName = location.pathname;

  //useState
  const [isOpenModal, setIsOpenModal] = useState(false);
  //사업자가 아니라면 로그인으로 보내기
  const userInfo = getCookie("user") ?? {};
  // console.log(userInfo);
  const { role } = userInfo;

  const hanldeClickSubmit = () => {
    navigateToLogin();
  };
  // 스크롤 top으로 이동

  useEffect(() => {
    moveTop();
  }, [pathName]);

  useEffect(() => {
    if (role && role.includes(ROLE.BUSI) === false) {
      console.log("사업자가 아닙니다.");
      setIsOpenModal(true);
    }
  }, []);

  // 채팅 알림
  // 채팅 알림
  const chatEventRef = useRef<null | EventSource>(null);
  const EventSource = EventSourcePolyfill || NativeEventSource;
  const [chatAlert, setChatAlert] = useState(false);
  //
  // 채팅 알림 받기
  const getChatAlarm = () => {
    const url = "/api/chat-notice";
    chatEventRef.current = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Connetction: "keep-alive",
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
      withCredentials: true,
    });

    // 기본 메세지 이벤트
    chatEventRef.current.onmessage = event => {
      console.log("새로운 알림:", event.data);
    };

    // "exist unread notice" 이벤트 수신 (백엔드 이벤트 이름 따라 변경 필수)
    chatEventRef.current.addEventListener("connect", event => {
      // console.log("안 읽은 알림 존재:", typeof event.data);
      if (event.data === "false") {
        console.log("없다고 말해");
        setChatAlert(false);
      } else {
        console.log("있다고 말해");
        setChatAlert(true);
      }
    });

    chatEventRef.current.onerror = async () => {
      // e: Event
      chatEventRef.current?.close();
      // 재연결
      setTimeout(getChatAlarm, 3000);
    };

    chatEventRef.current.onopen = () => {};
  };
  useEffect(() => {
    if (!accessToken) {
      return;
    }
    if (chatEventRef.current) {
      console.log("기존 SSE 연결 닫기");
      chatEventRef.current.close();
    }
    getChatAlarm();
    return () => {
      chatEventRef.current?.close();
    };
  }, [chatEventRef]);
  useEffect(() => {
    console.log("chatAlert", chatAlert);
  }, [chatAlert]);
  return (
    <div className="max-w-[768px] min-w-xs mx-auto relative min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      {isOpenModal && (
        <CenterModalTs
          type="warning"
          content="사업자 회원가입 후 이용 가능한 페이지입니다."
          handleClickSubmit={hanldeClickSubmit}
        />
      )}
      {/* 채팅 여부 버튼 */}
      {pathName !== "/business/register" && (
        <div className="sticky bottom-5 right-5 flex justify-end pointer-events-none">
          <div className="relative">
            <button
              className="aspect-square w-12 flex items-center justify-center
                            bg-primary text-white rounded-full shadow-lg py-2 m-2 text-2xl pointer-events-auto"
              onClick={() => {
                navigateToChat();
                setChatAlert(false);
              }}
            >
              <AiFillWechat />
            </button>
            <div
              className={`absolute top-2 right-2 w-3 h-3 bg-primary rounded-full border-2 border-white
              ${chatAlert ? "visible" : "invisible"}
              `}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLayout;
