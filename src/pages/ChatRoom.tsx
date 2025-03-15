import { Client } from "@stomp/stompjs";
import { Input, message } from "antd";
import axios from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { BsFillPatchPlusFill } from "react-icons/bs";
import { IoIosArrowUp } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { chatDataAtom, IChatData } from "../atoms/chatAtom";
import TitleHeaderTs from "../components/layout/header/TitleHeaderTs";
import { ProfilePic } from "../constants/pic";
import { chatDataSelector } from "../selectors/chatSelector";
import { getCookie } from "../utils/cookie";
import { moveTo } from "../utils/moveTo";

interface ISendMessage {
  message: string;
  sender: number;
  userName?: string;
  roomId?: number;
  createdAt?: string;
  error?: string | null;
}

interface IGetChatHistoryRes {
  code: string;
  data: IChatData[];
}

const ChatRoom = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // console.log("채팅방 토큰", accessToken);
  // useNavigate
  const navigate = useNavigate();
  const navigateToChatIndex = () => {
    navigate("/chat");
  };
  // 쿼리
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  // recoil
  const filteredChatHistory = useRecoilValue(chatDataSelector);
  const [chatHistory, setChatHistory] = useRecoilState(chatDataAtom);
  const resetChatHistory = useResetRecoilState(chatDataAtom);
  // useState
  const [connected, setConnected] = useState<boolean>(false);
  const [name, setName] = useState<number>(1);
  const [messages, setMessages] = useState<(ISendMessage | string)[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMore, _] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 1;
  const RETRY_DELAY = 5000; // 5초

  // 연결 상태 관리를 위한 상태 추가
  const [isReconnecting, setIsReconnecting] = useState(false);

  //useRef
  const clientRef = useRef<Client | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLUListElement>(null);
  // const retryCountRef = useRef<number>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // console.log("clientRef 현재 상황", clientRef.current);
  }, [clientRef.current]);

  //쿠키
  const userInfo = getCookie("user");
  const userId = userInfo?.userId;
  //임시
  useEffect(() => {
    if (userId !== 0) {
      setName(userId);
    }
  }, []);

  // api 채팅내역
  const getChatHistory =
    useCallback(async (): Promise<IGetChatHistoryRes | null> => {
      const url = `/api/chat-room`;
      setIsLoading(true);
      try {
        const res = await axios.get<IGetChatHistoryRes>(
          `${url}/${roomId}?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const resultData = res.data;
        // console.log("채팅내역", resultData);
        setChatHistory([...resultData.data, ...chatHistory]);
        setIsLoading(false);
        if (resultData) {
          setTimeout(() => {
            moveTo(scrollRef);
          }, 100);
        }
        return resultData;
      } catch (error) {
        console.log("채팅내역 조회 실패", error);
        setIsLoading(false);
        return null;
      }
    }, [messages]);

  useEffect(() => {
    getChatHistory();
    console.log("page", page);
  }, [page, getChatHistory]);

  // 커넥션
  // const url = `ws://localhost:8080/chat`;
  const url = `ws://112.222.157.157:5231/chat`;
  // 구독 경로
  const topic = `/sub/chat/${roomId}`;
  useEffect(() => {
    if (!accessToken || clientRef.current || isReconnecting) {
      return;
    }

    const stompClient = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: RETRY_DELAY,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // 연결 성공
      onConnect: async frame => {
        // console.log("Connected: ", frame);
        setRetryCount(0);
        setIsReconnecting(false);
        clientRef.current = stompClient;
        try {
          stompClient.subscribe(
            topic,
            message => {
              // console.log("받은 메세지:", message);
              try {
                const receivedMessage = JSON.parse(message.body);
                // console.log("파싱된 메세지:", receivedMessage);
                setMessages(prev => [...prev, receivedMessage]);
              } catch (error) {
                // console.log("일반 텍스트 메시지:", message.body);
                setMessages(prev => [...prev, message.body]);
              }
            },
            {
              Authorization: `Bearer ${accessToken}`,
            },
          );
          setConnected(true);

          if (stompClient.connected) {
            await stompClient.publish({
              destination: "/pub/chat.join",
              body: JSON.stringify({
                roomId: roomId,
                sender: userId,
              }),
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            // console.log("채팅방 입장 성공");
          }
        } catch (error) {
          console.error("Error in connection setup:", error);
          handleDisconnect();
        }
      },
      onDisconnect: () => {
        handleDisconnect();
      },
      onWebSocketError: error => {
        console.error("WebSocket error: ", error);
        handleDisconnect();
      },
      onStompError: frame => {
        console.error("STOMP 에러: ", frame.headers["message"], frame.body);
        handleDisconnect();
      },
    });

    clientRef.current = stompClient;
    stompClient.activate();

    return () => {
      if (clientRef.current?.connected) {
        console.log("Component unmounting - Cleaning up connection");
        clientRef.current.unsubscribe(topic);
        clientRef.current.deactivate();
        setConnected(false);
        setIsReconnecting(false);
        clientRef.current = null;
      }
    };
  }, [accessToken, isReconnecting]);

  const handleDisconnect = useCallback(() => {
    setConnected(false);
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }

    if (retryCount < MAX_RETRIES && !isReconnecting) {
      setRetryCount(prev => prev + 1);
      setIsReconnecting(true);
      console.log(`재연결 시도 ${retryCount + 1}/${MAX_RETRIES}`);

      setTimeout(() => {
        setIsReconnecting(false);
      }, RETRY_DELAY);
    } else if (retryCount >= MAX_RETRIES) {
      console.log("최대 재연결 시도 횟수 도달");
      message.error("채팅 연결에 실패했습니다. 페이지를 새로고침해주세요.");
    }
  }, [retryCount, isReconnecting]);

  // 채팅 메시지 전송 함수
  const sendMessage = (): void => {
    if (clientRef.current && inputMessage.trim() && connected) {
      try {
        console.log("Sending message:", inputMessage);
        if (clientRef.current.connected) {
          clientRef.current.publish({
            destination: "/pub/chat.sendMessage",
            body: JSON.stringify({
              roomId: roomId,
              sender: name,
              message: inputMessage,
            }),
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }

        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("메세지 전송 오류: 커넥트 끊김 또는 메세지 입력 없음");
    }
  };
  // 나가기
  const handleClickToBack = () => {
    navigateToChatIndex();
    resetChatHistory();
  };
  // 관찰
  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target.isIntersecting && !isLoading) {
      console.log("페이지 증가");
      setPage(prevPage => prevPage + 1);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    // 관찰 시작
    if (observerTarget.current && isMore) {
      observer.observe(observerTarget.current);
    }
    // cleanup
    return () => observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    // getChatHistory();
    console.log("page", page);
  }, [page, getChatHistory]);

  // 스크롤 이벤트(버튼)
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-[768px] min-w-xs mx-auto relative min-h-screen ">
      <TitleHeaderTs
        title="채팅"
        icon="back"
        onClick={handleClickToBack}
        scrollEvent={false}
      />
      {/* 채팅 인터페이스 (연결된 경우에만 표시) */}
      <div className="min-h-[calc(100vh-100px)] pt-[16px]">
        <ul
          ref={chatContainerRef}
          className="h-full overflow-y-auto
          flex flex-col gap-[16px]"
        >
          <li className="flex items-center justify-center text-slate-400 gap-[12px] px-[16px]">
            {typeof messages[0] !== "string" && `채팅방에 입장하였습니다.`}
          </li>
          {filteredChatHistory?.map((item, index) => {
            return item.signedUser === true ? (
              <li
                key={index}
                className="flex items-center justify-end gap-[12px] px-[16px]"
              >
                <div className="flex items-end gap-3">
                  <p className="text-sm text-slate-400">{item.createdAt}</p>
                  <p
                    className="flex items-center justify-center bg-primary px-[16px] py-[12px]
                    rounded-b-xl rounded-tl-xl
                    text-white text-base
                    max-w-56 break-all"
                  >
                    {item.message}
                  </p>
                </div>
              </li>
            ) : (
              <li
                key={index}
                className="flex items-start justify-start gap-[12px] px-[16px]"
              >
                <div className="aspect-square w-[8vw] max-w-[35px] max-h-[35px] bg-slate-500 rounded-full overflow-hidden">
                  <img
                    src={`${ProfilePic}/${item.senderId}/${item.senderPic}`}
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <p className="text-sm text-slate-700 font-semibold">
                    {item.senderName}
                  </p>
                  <div className="flex items-center gap-[6px]">
                    <p
                      className="flex items-center justify-center bg-slate-100 px-[16px] py-[12px]
                    rounded-b-xl rounded-tr-xl
                    text-slate-700 text-base
                    max-w-56 break-all"
                    >
                      {item.message}
                    </p>
                    <p className="text-sm text-slate-400">{item.createdAt}</p>
                  </div>
                </div>
              </li>
            );
          })}
          <div ref={scrollRef} className="pb-[80px]">
            {/* 스크롤 이벤트 처리 */}
          </div>
          <div id="observer" ref={observerTarget}>
            {/* 페이징 처리 관찰 대상 */}
          </div>
        </ul>
        {/* 메시지 입력 필드 추가 */}
        <div
          className="flex items-center gap-[12px]
                    px-[16px] py-[16px]
                    bg-white
                    max-w-[768px] w-full h-auto fixed bottom-0 left-1/2 -translate-x-1/2
                    "
        >
          <Input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="메세지 입력"
            onPressEnter={e => {
              if (inputMessage.trim() && e.key === "Enter") {
                sendMessage();
              }
            }}
            className="px-[16px] py-[12px]"
          />
          <button type="button" onClick={sendMessage}>
            <BsFillPatchPlusFill className="text-3xl text-primary" />
          </button>
          {/* 위로가기 */}
          <div
            className={`absolute bottom-[100px] left-0 translate-x-1/2 transition-all duration-300 ${
              showScrollButton ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <button
              type="button"
              className="bg-primary text-white rounded-full p-1 text-xl shadow-lg hover:bg-primary/90 transition-colors"
              onClick={scrollToTop}
            >
              <IoIosArrowUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ChatRoom);
