import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReactNode } from "react";
import { IStrf } from "../../../types/interface";
import { matchRestDataToKor } from "../../../utils/match";
import ListItem from "./ListItem";
import { useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";
dayjs.extend(customParseFormat);

interface OperationInfoProps {
  children?: ReactNode;
  strfData: IStrf;
}

const OperationInfo = ({ strfData }: OperationInfoProps): JSX.Element => {
  // 쿼리
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  console.log(strfData);
  const { startAt, endAt, closeCheck, openCheck, restDate } = strfData;

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
      {category === CategoryType.FEST && (
        <ListItem title="영업 시간" content={busiHour} type="busiHour" />
      )}
      <ListItem title="입실/퇴실 시간" content={checkTime} type="checkTime" />
      <ListItem title="휴무일" content={restDateKor} type="restDate" />
      <ListItem title="임시 휴무일 등록" content={checkTime} type="tempRest" />
    </>
  );
};

export default OperationInfo;
