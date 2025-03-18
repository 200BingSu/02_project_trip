import { Popover } from "antd";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";
import ListItem from "./ListItem";

const BasicInfo = (): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  return (
    <>
      <ListItem title="업체 이름" type="title" />
      <ListItem title="업체 전화번호" type="tell" />
      <ListItem title="업체 소개" type="detail" />
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
          type="amenity"
        />
      )}
      <ListItem title="업체 주소" type="address" />
      <ListItem title="업체 사진" type="strfPic" />
    </>
  );
};

export default BasicInfo;
