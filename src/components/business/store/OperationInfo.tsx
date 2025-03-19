import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReactNode } from "react";
// import { matchRestDataToKor } from "../../../utils/match";
import { useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";
import ListItem from "./ListItem";
dayjs.extend(customParseFormat);

interface OperationInfoProps {
  children?: ReactNode;
}

const OperationInfo = ({}: OperationInfoProps): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  // const { startAt, endAt, closeCheck, openCheck, restDate } = strfData;

  // const busiHour = [startAt, endAt];
  // const checkTime = [
  //   dayjs(openCheck, "HH:mm:ss").format("HH:mm"),
  //   dayjs(closeCheck, "HH:mm:ss").format("HH:mm"),
  // ];
  // const restDateKor = restDate.map(item => {
  //   return matchRestDataToKor(item);
  // });
  const matchCheck = (category: string) => {
    if (category === CategoryType.STAY) {
      return "입실/퇴실 시간";
    }
    if (category === CategoryType.RESTAURANT) {
      return "영업 시간";
    }
    if (category === CategoryType.TOUR || CategoryType.FEST) {
      return "개장 시간";
    }
  };
  return (
    <>
      {category === CategoryType.FEST && (
        <ListItem title="축제 기간" type="duration" />
      )}
      <ListItem title="업체 상태" type="state" />
      <ListItem title={matchCheck(category as string)} type="checkTime" />
      <ListItem title="휴무일" type="restDate" />
      {/* <ListItem title="임시 휴무일 등록" type="tempRest" /> */}
    </>
  );
};

export default OperationInfo;
