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
  // useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
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

  //useRef
  const clientRef = useRef<Client | null>(null);
  const connectionRef = useRef<boolean>(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    console.log("connectionRef", connectionRef.current);
  }, [connectionRef]);
  useEffect(() => {
    console.log("messages", messages);
  }, [messages]);

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
        console.log("채팅내역", resultData);
        setChatHistory(resultData.data);
        setIsLoading(false);
        return resultData;
      } catch (error) {
        console.log("채팅내역 조회 실패", error);
        setIsLoading(false);
        return null;
      }
    }, []);

  useEffect(() => {
    getChatHistory();
  }, [messages]);

  // 커넥션
  // const url = `ws://localhost:8080/chat`;
  const url = `ws://112.222.157.157:5231/chat`;
  // 구독 경로
  const topic = `/sub/chat/${roomId}`;
  useEffect(() => {
    const stompClient = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // 연결 성공
      onConnect: async frame => {
        console.log("Connected: ", frame);
        stompClient.subscribe(
          topic,
          message => {
            console.log("받은 메세지:", message);
            try {
              const receivedMessage = JSON.parse(message.body);
              console.log("파싱된 메세지:", receivedMessage);
              setMessages(prev => [...prev, receivedMessage]);
            } catch (error) {
              console.log("일반 텍스트 메시지:", message.body);
              setMessages(prev => [...prev, message.body]);
            }
          },
          {
            Authorization: `Bearer ${accessToken}`,
          },
        );
        setConnected(true);
        connectionRef.current = true;
        //바로 방 입장
        try {
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
          console.log("채팅방 입장 성공");
        } catch (error) {
          console.error("Error joining room:", error);
        }
      },
      // 연결 해제
      onDisconnect: () => {
        console.log("Disconnected");
        connectionRef.current = false;
        setConnected(false);
        // message.error("채팅연결에 실패했습니다");
      },
      onWebSocketError: error => {
        console.error("WebSocket error: ", error);
        connectionRef.current = false;
        setConnected(false);
        message.error("채팅연결에 실패했습니다");
      },
      onStompError: frame => {
        console.error("STOMP error: ", frame.headers["message"], frame.body);
        connectionRef.current = false;
        setConnected(false);
        message.error("채팅연결에 실패했습니다");
      },
    });

    clientRef.current = stompClient;

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        console.log(
          "Component unmounting - Connection status:",
          clientRef.current.connected,
        );
        clientRef.current.unsubscribe(topic);
        clientRef.current.deactivate();
      }
    };
  }, []);

  // connect 함수 수정
  const connect = (): void => {
    if (clientRef.current) {
      clientRef.current.activate();
      connectionRef.current = true;
    }
  };

  // disconnect 함수 수정
  const disconnect = (): void => {
    console.log("연결 해제");
    if (clientRef.current) {
      clientRef.current.unsubscribe(topic);
      // clientRef.current.deactivate();
      setConnected(false);
      setMessages([]);
      connectionRef.current = false;
    }
  };

  // 채팅 메시지 전송 함수
  const sendMessage = (): void => {
    if (clientRef.current && inputMessage.trim() && connected) {
      try {
        console.log("Sending message:", inputMessage);
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
        setInputMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("메세지 전송 오류: 커넥트 끊김 또는 메세지 입력 없음");
    }
  };
  // 나가기
  const handleClickToBack = async () => {
    await navigateToBack();
    await disconnect();
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
    getChatHistory();
    console.log("page", page);
  }, [page, getChatHistory]);

  useEffect(() => {
    connect();
  }, []);
  // 스크롤 이벤트
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

  // 초기 채팅 내역을 불러온 후 스크롤 조정
  useEffect(() => {
    if (chatContainerRef.current && chatHistory.length > 0) {
      const container = chatContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      container.scrollTo({
        top: maxScroll,
        behavior: "auto", // 초기 로딩시에는 즉시 스크롤
      });
    }
  }, [chatHistory.length]); // chatHistory가 처음 로드될 때 실행

  // 새로운 메시지에 대한 기존 스크롤 효과는 유지
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      container.scrollTo({
        top: maxScroll,
        behavior: "smooth",
      });
    }
  }, [filteredChatHistory]);

  // 새로운 메시지가 추가될 때 스크롤 조정
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      // 부드러운 스크롤 효과로 이동
      container.scrollTo({
        top: maxScroll,
        behavior: "smooth",
      });
    }
  }, [filteredChatHistory]);

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
        flex flex-col gap-[16px] pb-20"
        >
          {/* {messages?.map((item: ISendMessage | string, index) => {
            return (
              <li key={index}>
                {typeof item === "string"
                  ? item
                  : item.userName
                    ? `${item?.userName}가 입장합니다.`
                    : `${item?.sender}: ${item?.message}`}
              </li>
            );
          })} */}
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
