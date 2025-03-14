import { useRecoilValue } from "recoil";
import { getCookie } from "../../utils/cookie";
import { formatId } from "../../utils/format";
import { strfAtom } from "../../atoms/strfAtom";

const StrfInfo = (): JSX.Element => {
  const userInfo = getCookie("user");
  const strfData = useRecoilValue(strfAtom);
  const strfId = userInfo?.strfDtos[0].strfId;
  const title = userInfo?.strfDtos[0].title;

  const category = userInfo?.strfDtos[0].category;
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
