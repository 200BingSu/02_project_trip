import { useSearchParams } from "react-router-dom";
import { announcementMock } from "../../../constants/announcement";

const Detail = () => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const announcementId = Number(searchParams.get("announcementId"));
  const tempData = announcementMock.find(item => item.id === announcementId);
  console.log(tempData);
  return (
    <div>
      <div className="px-4 py-4 flex justify-center items-center border-b border-slate-200">
        <h3 className="text-2xl font-bold">{tempData?.label}</h3>
      </div>
      <section className="px-6 py-7 flex flex-col gap-3">
        <p className="text-sm text-slate-500">{tempData?.createAt}</p>
        <p className="text-base text-slate-700">{tempData?.content}</p>
      </section>
    </div>
  );
};

export default Detail;
