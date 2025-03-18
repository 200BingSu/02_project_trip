import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AnnouncementItemProps {
  item: {
    id: number;
    label: string;
    content: string | ReactNode;
    createAt: string;
  };
}

const AnnouncementItem = ({ item }: AnnouncementItemProps) => {
  const navigate = useNavigate();

  const navigateToDetail = () => {
    navigate(`/announcement/detail?announcementId=${item.id}`);
  };
  return (
    <li
      className="px-4 py-5 flex flex-col gap-2 border-b border-slate-200 cursor-pointer"
      onClick={navigateToDetail}
    >
      <h4 className="text-xl font-medium text-slate-700">{item.label}</h4>
      <p className="text-sm text-slate-500">{item.createAt}</p>
    </li>
  );
};

export default AnnouncementItem;
