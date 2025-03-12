import { ReactNode, useEffect, useState } from "react";
import { FcPlanner, FcPlus } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import { IAPI } from "../../../types/interface";

interface NoticaProps {
  noticeId: string;
  category: string;
  opened: boolean;
  txt: string;
  noticedAt: string;
}

const NotnicoArr = (category: string): ReactNode => {
  const iconMap: Record<string, ReactNode> = {
    TRIP: (
      <img
        src={`/public/images/notification/luggage_1f9f3.png`}
        alt="luggage"
      />
    ),
    CHAT: (
      <img
        src={`/public/images/notification/speech-balloon_1f4ac.png`}
        alt="speech-balloon"
      />
    ),
    AD: (
      <img
        src={`/public/images/notification/pushpin_1f4cc.png`}
        alt="pushpin"
      />
    ),
    COUPON: (
      <img src={`/public/images/notification/ticket_1f3ab.png`} alt="ticket" />
    ),
    SERVICE: (
      <img src={`/public/images/notification/bell_1f514.png`} alt="bell" />
    ),
    BOOKING: <FcPlanner className="text-3xl" />,
    POINT: <FcPlus className="text-3xl" />,
  };
  return iconMap[category] || null; // 없는 카테고리는 null 반환
};

const cateArr: Record<string, string> = {
  TRIP: "여행",
  CHAT: "채팅",
  AD: "광고",
  COUPON: "쿠폰",
  SERVICE: "서비스",
  BOOKING: "예약",
  POINT: "포인트",
};

const PushNotification = (): JSX.Element => {
  const [notica, setNotica] = useState<IAPI<NoticaProps[]>>();
  const navigate = useNavigate();

  const getNotica = async (): Promise<IAPI<NoticaProps[]> | void> => {
    try {
      const res = await jwtAxios.get<IAPI<NoticaProps[]>>(
        "/api/notice/check?start_idx=0",
      );
      setNotica(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (noticeId: string) => {
    try {
      const res = await jwtAxios.get(
        `/api/notice/check-one?notice_id=${noticeId}`,
      );
      console.log(res.data);
      getNotica();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotica();
  }, []);

  return (
    <div>
      <TitleHeaderTs title="알림" icon="back" onClick={() => navigate("/")} />
      <ul>
        {notica?.data.map(item => (
          <li
            key={item.noticeId}
            onClick={() => handleClick(item.noticeId)}
            className={`flex gap-3 px-4 py-5 border-b border-slate-100 ${item.opened === false ? "bg-slate-100" : "bg-white"}`}
          >
            <i className="inline-block min-w-[30px] w-8 aspect-square">
              {NotnicoArr(item.category)}
            </i>
            <div>
              <p className="text-sm text-slate-400">
                {cateArr[item.category] || item.category}
              </p>
              <p className="text-base font-semibold text-slate-700 my-1 line-clamp-2 leading-5">
                {item.txt}
              </p>
              <p className="text-sm text-slate-400">{item.noticedAt}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PushNotification;
