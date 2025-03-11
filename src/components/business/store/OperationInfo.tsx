import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReactNode } from "react";
import { IStrf } from "../../../types/interface";
import { matchRestDataToKor } from "../../../utils/match";
import ListItem from "./ListItem";
dayjs.extend(customParseFormat);

interface OperationInfoProps {
  children?: ReactNode;
  strfData: IStrf;
}
const OperationInfo = ({ strfData }: OperationInfoProps): JSX.Element => {
  // 쿼리
  console.log(strfData);

  const { startAt, endAt, closeCheck, openCheck, restDate } = strfData;
  if (
    !strfData ||
    !startAt ||
    !endAt ||
    !closeCheck ||
    !openCheck ||
    !restDate
  ) {
    // strfData가 없거나 필요한 값들이 없을 경우 처리
    return <div>데이터가 없거나 불완전합니다</div>;
  }
  const busiHour = [startAt, endAt];
  const checkTime = [
    dayjs(openCheck, "HH:mm:ss").format("HH:mm"),
    dayjs(closeCheck, "HH:mm:ss").format("HH:mm"),
  ];
  const restDateKor = restDate.map(item => {
    return matchRestDataToKor(item);
  });

  return (
    <>
      <ListItem title="영업 시간" content={busiHour} type="busiHour" />
      <ListItem title="입실/퇴실 시간" content={checkTime} type="checkTime" />
      <ListItem title="휴무일" content={restDateKor} type="restDate" />
      <ListItem title="임시 휴무일 등록" content={checkTime} type="tempRest" />
    </>
  );
};

export default OperationInfo;
