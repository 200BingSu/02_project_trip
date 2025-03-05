import React, { useEffect, useState } from "react";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import ChatList from "../../../components/chat/ChatList";
import { IChatList } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import axios from "axios";
import { LiaComment } from "react-icons/lia";

interface IChatCategory {
  key: string;
  label: React.ReactNode;
}

interface IGetChatList {
  code: string;
  data: IChatList[];
}

const ChatIndex = () => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  const userInfo = getCookie("user");
  const role = userInfo.role[0];
  // useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };
  //useState
  const [category, setCategory] = useState<string>("전체");
  const [chatList, setChatLlist] = useState<IChatList[]>([]);
  const [page, setPage] = useState<number>(1);
  // APi 채팅방 목록
  const getChatList = async (): Promise<IGetChatList | null> => {
    try {
      const url = "/api/chat-room";
      const res = await axios.get<IGetChatList>(
        `${url}?page=${page}&role=${role}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("채팅 목록 조회", resultData);
      if (resultData.code === "200 성공") {
        setChatLlist(resultData.data);
      }
      return resultData;
    } catch (error) {
      console.log("채팅 목록 조회", error);
      setChatLlist([]);
      return null;
    }
  };
  // 채팅 카테고리
  const chatCategory: IChatCategory[] = [
    {
      key: "전체",
      label: <p className="text-lg">전체</p>,
    },
    {
      key: "예약문의",
      label: <p className="text-lg">예약문의</p>,
    },
    {
      key: "여행톡",
      label: <p className="text-lg">여행톡</p>,
    },
  ];

  const onChange = (key: string): void => {
    // console.log(key);
    setCategory(key);
  };
  // useEffect
  useEffect(() => {
    getChatList();
  }, []);

  return (
    <div>
      <TitleHeaderTs title="채팅" icon="back" onClick={navigateToBack} />
      <div>
        <Tabs
          defaultActiveKey="전체"
          items={chatCategory}
          onChange={onChange}
          className="px-[16px]"
        />
        {chatList.length > 0 ? (
          <ChatList category={category} chatList={chatList} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-[16px] pt-28">
            <i className="text-6xl text-slate-400">
              <LiaComment />
            </i>
            <p className="text-slate-400">채팅 목록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatIndex;
