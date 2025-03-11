import { Popover } from "antd";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";
import { IStrf } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import ListItem from "./ListItem";
import { matchState } from "../../../utils/match";

interface BasicInfoProps {
  strfData: IStrf;
}

const BasicInfo = ({ strfData }: BasicInfoProps): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  // 쿠키
  const userInfo = getCookie("user");
  const nowTitle = userInfo.strfDtos[0].title;

  // console.log(strfData);
  const { state = 0, tell = "", detail = "", amenity = [] } = strfData ?? {};

  return (
    <>
      <ListItem title="업체 이름" content={nowTitle} type="title" />
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
          content={amenity}
          type="amenity"
        />
      )}
    </>
  );
};

export default BasicInfo;
