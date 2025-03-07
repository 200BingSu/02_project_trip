import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { IChatList } from "../../types/interface";
import { ProfilePic } from "../../constants/pic";

interface ChatListProps {
  category: string;
  chatList: IChatList[];
  children?: React.ReactNode;
}

const ChatList = ({ chatList }: ChatListProps): JSX.Element => {
  // navigate
  const navigate = useNavigate();
  const navigateToChatRoom = (roomId: string) => {
    navigate(`/chatroom?roomId=${roomId}`);
  };
  // console.log(category);
  return (
    <>
      <ul className="flex flex-col">
        {chatList.map((item, index) => {
          return (
            <li
              className="flex items-center justify-between gap-3 px-4 py-4 cursor-pointer"
              key={index}
              onClick={() => navigateToChatRoom(item.roomId)}
            >
              <div className="flex items-center gap-3">
                {/* 사진 */}
                <div className="w-14 h-14 bg-slate-200 flex items-center justify-center rounded-2xl overflow-hidden">
                  <img src={`${ProfilePic}/${item.pic}`} alt="채팅방 사진" />
                </div>
                {/* 이름, 마지막 채팅 */}
                <div className="flex flex-col gap-[5px]">
                  <p className="text-lg text-slate-700 font-semibold">
                    {item.title}
                    {/* <span className="text-slate-300">다인원</span> */}
                  </p>
                  <p>{item.latestChat}</p>
                </div>
              </div>

              {/* 시간, 알림 */}
              <div className="flex flex-col items-end justify-between">
                <p className="text-sm text-slate-400">{item.lastChatTime}</p>
                {item.unreadChat && (
                  <p className="px-3 py-[5px] bg-primary rounded-2xl text-white text-sm">
                    {item.unreadChat}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default memo(ChatList);
