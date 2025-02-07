import { Form, Input } from "antd";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../constants/pic";
import { getCookie } from "../../utils/cookie";

const categoryArr = ["다가오는 여행", "완료된 여행"];
const UserTrips = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState([]);
  const [tripListData, setTripListData] = useState({});
  const [form] = Form.useForm();

  const getTripList = async () => {
    try {
      const res = await axios.get(`/api/trip-list`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      //   console.log(res.data);
      const resultData = res.data;
      const beforeArr = resultData.beforeTripList;
      const afterArr = resultData.afterTripList;

      setTripListData(resultData.data);
    } catch (error) {
      console.log("여행 목록 불러오기:", error);
    }
  };

  useEffect(() => {
    if (userInfo.accessToken) {
      getTripList();
    }
  }, []);
  // useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const navigateGoTrip = item => {
    console.log(item);
    navigate(`/schedule/index?tripId=${item.tripId}`);
  };

  const [category, setCategory] = useState(0);

  useEffect(() => {
    console.log("카테고리", category);
  }, [category]);
  // 미완료 여행 목록 불러오기

  console.log("✅  useProfile:", useProfile);
  console.log("tripListData", tripListData);

  return (
    <div className="flex flex-col gap-[30px]">
      <TitleHeader icon="back" title="여행" onClick={navigateBack} />
      {/* 유저 정보 */}
      <div className="mt-[90px] flex flex-col gap-[14px] items-center justify-center w-full">
        {/* 프로필 이미지 */}
        <div className="w-[120px] h-[120px] rounded-full overflow-hidden bg-slate-100">
          <img
            src={`${ProfilePic}${userInfo?.userId}/${useProfile?.profilePic}`}
            alt="유저 이미지"
            className="w-full h-full"
          />
        </div>
        <p className="text-[30px] text-slate-700 font-bold">
          {/* {useProfile?.name} */}
        </p>
      </div>
      {/* 여행코드 입력창 */}
      <div className="px-[32px] flex flex-col gap-[5px]">
        <p className="text-slate-500 text-[18px] font-semibold">여행코드</p>
        <Input
          placeholder="친구와 여행을 함께하기 위해 코드를 입력해주세요"
          className="px-[32px] py-[20px] h-[79px]"
        />
      </div>
      {/* 여행 리스트 카테고리 */}
      <div className="px-[32px]">
        <ul className="flex items-center">
          {categoryArr.map((item, index) => {
            return (
              <li
                className={`cursor-pointer w-full flex justify-center items-center
                            pt-[17px] pb-[16px]
                            ${category === index ? `text-primary border-b-[2px] border-primary` : `text-slate-400 border-b border-slate-200`}`}
                key={index}
                onClick={() => {
                  setCategory(index);
                }}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
      {/* 여행 목록 */}
      <div className="px-[28px] mb-[40px]">
        {/* 다가오는 여행 */}
        {category === 0 && (
          <ul className="flex flex-col gap-[40px]">
            {tripListData?.beforeTripList?.map((item, index) => {
              return (
                <li className="flex items-center justify-between" key={index}>
                  {/* 좌측 */}
                  <div className="flex items-center gap-[29px]">
                    {/* 이미지 */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-full">
                      <img src="" alt="" />
                    </div>
                    {/* 정보 */}
                    <div className="flex flex-col gap-[5px]">
                      <h3 className="text-[24px] text-slate-700 font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-[18px] text-slate-500">
                        <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      </p>
                    </div>
                  </div>
                  {/* 우측 */}
                  <button
                    className="w-[36px] h-[36px] bg-slate-100 px-[10px] py-[10px] rounded-full"
                    onClick={() => {
                      navigateGoTrip(item);
                    }}
                  >
                    <AiOutlinePlus className="text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {/* 완료된 여행 */}
        {category === 1 && (
          <ul className="flex flex-col gap-[40px]">
            {tripListData.afterTripList?.map((item, index) => {
              return (
                <li className="flex items-center justify-between" key={index}>
                  {/* 좌측 */}
                  <div className="flex items-center gap-[29px]">
                    {/* 이미지 */}
                    <div className="w-[100px] h-[100px] bg-slate-100 rounded-full">
                      <img src="" alt="" />
                    </div>
                    {/* 정보 */}
                    <div className="flex flex-col gap-[5px]">
                      <h3 className="text-[24px] text-slate-700 font-semibold">
                        {item.title}
                      </h3>
                      <p className="text-[18px] text-slate-500">
                        <span>{item.startAt}</span>~<span>{item.endAt}</span>
                      </p>
                    </div>
                  </div>
                  {/* 우측 */}
                  <button
                    className="w-[36px] h-[36px] bg-slate-100 px-[10px] py-[10px] rounded-full"
                    onClick={() => {
                      navigateGoTrip(item);
                    }}
                  >
                    <AiOutlinePlus className="text-slate-400" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserTrips;
