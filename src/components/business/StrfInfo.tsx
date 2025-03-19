import { useEffect, useState } from "react";
import { getCookie } from "../../utils/cookie";
import { formatId } from "../../utils/format";

const StrfInfo = (): JSX.Element => {
  const userInfo = getCookie("user");

  // const strfId = userInfo?.strfDtos[0].strfId;
  // const title = userInfo?.strfDtos[0].title;
  // const category = userInfo?.strfDtos[0].category;
  const [strfId, setStrfId] = useState(0);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  useEffect(() => {
    setStrfId(userInfo?.strfDtos[0].strfId);
    setTitle(userInfo?.strfDtos[0].title);
    setCategory(userInfo?.strfDtos[0].category);
  }, [userInfo]);
  return (
    <div className="bg-slate-100 px-4 py-3 mb-3 flex flex-col gap-2">
      <h3 className="text-xl font-semibold text-slate-700">
        {title ?? "업체 이름"}
      </h3>
      <p className="text-base text-slate-400">
        {formatId(strfId as number)} | {category ?? "숙소"}
      </p>
    </div>
  );
};

export default StrfInfo;
