import { Popover } from "antd";
import { IStrf } from "../../../types/interface";
import ListItem from "./ListItem";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";

interface BasicInfoProps {
  strfData: IStrf;
}

const BasicInfo = ({ strfData }: BasicInfoProps): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  console.log(strfData);
  const { state = 0, tell = "", detail = "", amenity = [] } = strfData ?? {};
  const matchState = (state: number) => {
    switch (state) {
      case 0:
        return "영업중";
      case 1:
        return "휴업";
      case 2:
        return "폐업";
      default:
        return "알 수 없음";
    }
  };
  if (!strfData) {
    return <div>Loading...</div>; // 또는 로딩 중 메시지나 대체 UI를 반환
  }
  return (
    <>
      <ListItem title="업체 상태" content={matchState(state)} type="state" />
      <ListItem title="업체 전화번호" content={tell as string} type="tell" />
      <ListItem title="업체 소개" content={detail} type="detail" />
      {category === CategoryType.STAY && (
        <ListItem
          title={
            <span className="flex items-center gap-2">
              업체 편의 정보{" "}
              <Popover
                trigger={"hover"}
                placement="right"
                content={"* 검색 시 사용되는 정보입니다."}
              >
                <button type="button">
                  <AiOutlineQuestionCircle className="text-lg text-slate-300 cursor-help" />
                </button>
              </Popover>
            </span>
          }
          content={matchState(state)}
          type="amenity"
        />
      )}
    </>
  );
};

export default BasicInfo;
