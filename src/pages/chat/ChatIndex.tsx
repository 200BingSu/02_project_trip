import React, { useState } from "react";
import TitleHeaderTs from "../../components/layout/header/TitleHeaderTs";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import ChatList from "../../components/chat/ChatList";

interface IChatCategory {
  key: string;
  label: React.ReactNode;
}

const ChatIndex = () => {
  // useNavigate
  const navigate = useNavigate();
  const navigateToBack = () => {
    navigate(-1);
  };
  //useState
  const [category, setCategory] = useState<string>("전체");
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
        <ChatList category={category} />
      </div>
    </div>
  );
};

export default ChatIndex;
