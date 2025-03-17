import { ReactNode, useEffect, useState } from "react";
import { FcPlanner, FcPlus } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../apis/jwt";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import Notification from "../../../components/user/Notification";
import { Button } from "antd";

interface NoticaProps {
  noticeId: string;
  category: string;
  opened: boolean;
  txt: string;
  noticedAt: string;
}

export interface NotiDetailProps {
  noticeId: string;
  title: string;
  content: string;
  category: string;
  noticedAt: string;
  foreignNum: string;
}

interface NoticeResponse {
  noticeLines: NoticaProps[];
  more: boolean;
}

const NotnicoArr = (category: string): ReactNode => {
  const iconMap: Record<string, ReactNode> = {
    TRIP: <img src={`/images/notification/luggage_1f9f3.png`} alt="luggage" />,
    CHAT: (
      <img
        src={`/images/notification/speech-balloon_1f4ac.png`}
        alt="speech-balloon"
      />
    ),
    AD: <img src={`/images/notification/pushpin_1f4cc.png`} alt="pushpin" />,
    COUPON: <img src={`/images/notification/ticket_1f3ab.png`} alt="ticket" />,
    SERVICE: <img src={`/images/notification/bell_1f514.png`} alt="bell" />,
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
  const [notica, setNotica] = useState<NoticaProps[]>([]);
  const [notiDetail, setNotiDetail] = useState<NotiDetailProps | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedNT, setSelectedNT] = useState<NoticaProps | null>(null);
  const [startIdx, setStartIdx] = useState(0);
  const [isMore, setIsMore] = useState<boolean>(false);

  const navigate = useNavigate();

  const getNotica = async () => {
    try {
      const res = await jwtAxios.get(`/api/notice/check?start_idx=${startIdx}`);
      if (startIdx === 0) {
        setNotica(res.data.data.noticeLines); // 첫 로드시 새로운 데이터로 설정
      } else {
        setNotica(prev => [...prev, ...res.data.data.noticeLines]); // 기존 데이터에 새 데이터 추가
      }
      setIsMore(res.data.data.more);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = async (noticeId: string) => {
    try {
      const res = await jwtAxios.get(
        `/api/notice/check-one?notice_id=${noticeId}`,
      );
      setNotiDetail(res.data.data);
      const notice = notica.find(item => item.noticeId === noticeId);
      if (notice) {
        setSelectedNT(notice);
        setIsVisible(true);
        getNotica();
      }
    } catch (error) {
      console.log("알림 상세 정보 불러오기 실패:", error);
    }
  };

  const allCheck = async () => {
    try {
      const res = await jwtAxios.put("/api/notice/readAll");
      console.log(res);
      getNotica();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (startIdx > 0) {
      getNotica(); // startIdx가 0보다 클 때만 호출
    }
  }, [startIdx]); // startIdx 값이 변경될 때 getNotica 호출

  const handleMoreClick = () => {
    setStartIdx(prevIdx => prevIdx + 10);
    // getNotica는 useEffect를 통해 자동으로 호출됨
  };

  useEffect(() => {
    getNotica();
  }, []);

  return (
    <div>
      <TitleHeaderTs title="알림" icon="back" onClick={() => navigate("/")} />

      <div className="flex justify-between py-[14px] px-4 border-b-[1px] border-slate-100 ">
        <p className="text-sm font-semibold text-slate-700">
          전체 알림 {notica.length}
        </p>
        <p
          className="text-xs text-slate-500 underline underline-offset-[3px] cursor-pointer"
          onClick={allCheck}
        >
          모두 읽음으로 표시
        </p>
      </div>

      <ul>
        {notica?.map(item => (
          <li
            key={item.noticeId}
            onClick={() => handleClick(item.noticeId)}
            className={`cursor-pointer flex gap-3 px-4 py-5 border-b border-slate-100 last:border-0 ${item.opened === false ? "bg-slate-100" : "bg-white"}`}
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
      {isMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleMoreClick}
            className="h-auto py-2 px-5 rounded-full text-sm mb-6"
          >
            더보기
          </Button>
        </div>
      )}
      {selectedNT && notiDetail && (
        <Notification
          notiDetail={notiDetail}
          isVisible={isVisible}
          onClose={() => {
            setIsVisible(false);
            setSelectedNT(null);
            setNotiDetail(null);
          }}
        />
      )}
    </div>
  );
};

export default PushNotification;
