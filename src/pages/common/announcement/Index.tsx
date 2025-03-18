import AnnouncementItem from "../../../components/common/AnnouncementItem";
import { announcementMock } from "../../../constants/announcement";

const Index = () => {
  return (
    <ul className="px-4 py-4 flex flex-col">
      {announcementMock.map((item, index) => {
        return <AnnouncementItem item={item} key={index} />;
      })}
    </ul>
  );
};

export default Index;
