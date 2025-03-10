import { Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BasicInfo from "../../../components/business/store/BasicInfo";
import OperationInfo from "../../../components/business/store/OperationInfo";
import Tab from "../../../components/common/Tab";
import { IAPI, IRoom, IStrf } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";
import { CategoryType } from "../../../types/enum";
import { categoryKor } from "../../../utils/match";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";

const StoreIndex = (): JSX.Element => {
  // 쿠키
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  const category = searchParams.get("category");
  const tab = Number(searchParams.get("tab"));
  //recoil
  const [strfData, setStrfData] = useRecoilState(strfAtom);
  //useState
  const [cateIndex, setCateIndex] = useState<number>(tab);
  const [isLoading, setIsLoading] = useState(false);
  const [_, setRoomData] = useState<IRoom[]>([]);

  // API 상품 조회
  const getStrfInfo = async (): Promise<IAPI<IStrf> | null> => {
    const url = "/api/detail/member";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<IStrf>>(`${url}?strf_id=${strfId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(res.data);
      const resultData = res.data;
      if (resultData) {
        setStrfData({ ...strfData, ...resultData.data });
        setIsLoading(false);
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      console.log("상품조회", error);
      return null;
    }
  };
  // API 객실 조회
  const getRoomData = async (): Promise<IAPI<IRoom[]> | null> => {
    const url = "/api/detail/parlor";
    setIsLoading(true);
    try {
      const res = await axios.get<IAPI<IRoom[]>>(
        `${url}?strf_id=${strfId}&category=${categoryKor(category)}`,
      );
      const resultData = res.data;
      if (resultData) {
        setIsLoading(false);
        setRoomData(resultData.data);
      }
      console.log("객실 조회", resultData);
      return resultData;
    } catch (error) {
      console.log("객실 조회", error);
      return null;
    }
  };
  const categoryList = [
    {
      label: <p>기본 정보</p>,
      children: <BasicInfo strfData={strfData as IStrf} />,
    },
    {
      label: <p>운영 정보</p>,
      children: <OperationInfo strfData={strfData as IStrf} />,
    },
  ];
  const chageCateIndex = (index: number) => {
    setCateIndex(index);
  };
  //useEffect
  useEffect(() => {
    getStrfInfo();
    if (category === CategoryType.STAY) {
      getRoomData();
    }
  }, []);

  return (
    <div>
      <Spin spinning={isLoading}>
        <Tab
          list={categoryList}
          changeCateIndex={chageCateIndex}
          current={cateIndex}
        />
      </Spin>
    </div>
  );
};

export default StoreIndex;
