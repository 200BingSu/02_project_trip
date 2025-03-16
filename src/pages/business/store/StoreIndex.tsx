import { Spin } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { strfAtom } from "../../../atoms/strfAtom";
import BasicInfo from "../../../components/business/store/BasicInfo";
import OperationInfo from "../../../components/business/store/OperationInfo";
import Tab from "../../../components/common/Tab";
import { CategoryType } from "../../../types/enum";
import { Iamenity, IAPI, IStrf } from "../../../types/interface";
import { getCookie } from "../../../utils/cookie";

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
  console.log("strfData", strfData);
  //useState
  const [cateIndex, setCateIndex] = useState<number>(tab);
  const [isLoading, setIsLoading] = useState(false);
  // const [_, setRoomData] = useState<IRoom[]>([]);

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
      // console.log("상품 조회", res.data);
      const resultData = res.data;
      if (resultData) {
        const splitTell = resultData.data.tell.split("-");
        // console.log("splitTell", splitTell);

        setStrfData(prevData => ({
          ...prevData,
          ...resultData.data,
          areaCode: splitTell[0],
          tell: `${splitTell[1]}-${splitTell[2]}`,
        }));

        setIsLoading(false);
      }
      return resultData;
    } catch (error) {
      setIsLoading(false);
      console.log("상품조회", error);
      return null;
    }
  };

  // API 상품 편의 조회
  const getAmenity = async (): Promise<IAPI<Iamenity[]> | null> => {
    const url = "/api/detail/amenity";
    try {
      const res = await axios.get<IAPI<Iamenity[]>>(
        `${url}?strf_id=${strfId}&category=숙소`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      // console.log("상품 편의 조회", resultData);
      setStrfData(prevData => ({
        ...prevData,
        amenity: resultData.data.map(item => item.amenityId as number),
      }));
      return resultData;
    } catch (error) {
      return null;
    }
  };

  const categoryList = [
    {
      label: <p>기본 정보</p>,
      children: <BasicInfo />,
    },
    {
      label: <p>운영 정보</p>,
      children: <OperationInfo />,
    },
  ];
  const chageCateIndex = (index: number) => {
    setCateIndex(index);
  };
  //useEffect
  useEffect(() => {
    getStrfInfo();
    if (category === CategoryType.STAY) {
      getAmenity();
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
