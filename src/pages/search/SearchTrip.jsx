import { useNavigate, useSearchParams } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { tripAtom } from "../../atoms/tripAtom";
import SearchBar from "../../components/search/SearchBar";
import SearchList from "../../components/search/SearchList";
import SearchNone from "../../components/search/SearchNone";
import axios from "axios";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Input, Rate } from "antd";
import { FiSearch } from "react-icons/fi";
import SearchItems from "../../components/search/SearchItems";
import { AiFillHeart, AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { getCookie } from "../../utils/cookie";
import { ProductPic } from "../../constants/pic";

const strfArr = [
  { type: null, name: "전체" },
  { type: "TOUR", name: "관광지" },
  { type: "STAY", name: "숙소" },
  { type: "RESTAUR", name: "맛집" },
  { type: "FEST", name: "축제" },
];

const SearchTrip = () => {
  const accessToken = getCookie("accessToken");
  // recoil
  const [trip, setTrip] = useRecoilState(tripAtom);
  useEffect(() => {
    console.log("trip", trip);
  }, [trip]);
  const { nowTripId } = useRecoilValue(tripAtom);
  // 쿼리스트링
  const [searchParams] = useSearchParams();
  const tripId = parseInt(searchParams.get("tripId"));

  useEffect(() => {
    setSearchState(true);
  }, []);
  //useNavigate
  const navigate = useNavigate();
  const navigateContent = strfId => {
    console.log(strfId);
    navigate(`/contents/index?strfId=${strfId}`);
  };
  // useState
  const [lastIndex, setLastIndex] = useState(0);
  const [searchData, setSearchData] = useState({});
  const [searchState, setSearchState] = useState(false); // 검색 전, 후 구분
  const [inputValue, setInputValue] = useState(""); //검색 중 반영
  const [searchValue, setSearchValue] = useState(""); // 검색
  const [selectedCate, setSelectedCate] = useState(0);
  // useEffect(() => {
  //   if (searchData && searchData.locationTitleList) {
  //     const locationTitleArr = searchData.locationTitleList;
  //     const stringLocationTitle = locationTitleArr.join(", ");
  //     console.log("문자열 변환 결과:", stringLocationTitle);
  //     setInputValue(stringLocationTitle);
  //   }
  // }, [searchData]);
  useEffect(() => {
    console.log("searchValue", searchValue);
  }, [searchValue]);
  useEffect(() => {
    // getSearchWord(selectedCate);
  }, [selectedCate]);

  // 검색 결과 입력 전
  const getSearchBasic = async () => {
    const sendData = {
      trip_id: tripId,
      last_index: lastIndex,
    };
    console.log("검색 리퀘스트 데이터", sendData);
    try {
      const res = await axios.get(
        `/api/search/strf-list-basic?trip_id=${tripId}&last_index=0`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const resultData = res.data;
      console.log("결과-입력 전:", resultData);
      setSearchData(resultData.data);
    } catch (error) {
      console.log("결과-입력 전:", error);
    }
  };
  //검색 결과 입력 후
  const getSearchWord = async (cate = null) => {
    const sendData = {
      trip_id: tripId,
      last_index: lastIndex,
      category: cate,
      search_word: searchValue,
    };
    console.log("검색 리퀘스트 데이터", sendData);
    try {
      const res = await axios.get(
        `/api/search/strf-list-word?trip_id=${tripId}&last_index=${lastIndex}&search_word=${searchValue}`,
        sendData,
      );
      const resultData = res.data;
      console.log("결과-입력 후:", resultData);
      setSearchData(resultData.data);
    } catch (error) {
      console.log("결과-입력 후:", error);
    }
  };

  useEffect(() => {
    getSearchBasic();
  }, []);
  //리스트 배열
  const listArr = searchData?.list;

  // Input
  const onChange = e => {};

  return (
    <div className="w-full flex flex-col gap-[30px]">
      {/* 검색바 */}
      <div className="w-full px-[32px] py-[30px] flex items-center gap-[40px] relative ">
        {/* 뒤로가기 */}
        <div
          className="text-[36px] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoIosArrowRoundBack />
        </div>
        <Input
          placeholder="지금 어디로 여행을 떠나고 싶으신가요?"
          variant="borderless"
          prefix={<FiSearch className="text-slate-400 text-2xl" />}
          allowClear
          onChange={e => {
            onChange();
            setInputValue(e.target.value);
          }}
          onKeyDown={e => {
            if (e.code === "Enter") {
              setSearchValue(e.target.value);
              setSearchState(true);
              getSearchWord();
            }
          }}
          value={inputValue}
          className={`w-full h-[60px] px-[12px] ${inputValue ? "bg-white" : "bg-slate-100"}`}
        />
      </div>
      {/* 카테고리 */}
      {searchValue ? (
        <ul className="flex gap-[10px]">
          {strfArr.map((item, index) => {
            return (
              <li
                key={index}
                className={`cursor-pointer font-semibold text-[16px] w-[124px] flex justify-center items-center px-[15px] py-[10px] gap-[10px] rounded-[8px] ${index === selectedCate ? "bg-primary text-white" : "bg-white text-slate-500"}`}
                onClick={() => {
                  setSelectedCate(index);
                  // if (index === 0) {
                  //   moveTo(tourRef);
                  // } else if (index === 1) {
                  //   moveTo(tourRef);
                  // } else if (index === 2) {
                  //   moveTo(stayRef);
                  // } else if (index === 3) {
                  //   moveTo(restaurantRef);
                  // } else if (index === 4) {
                  //   moveTo(festivalRef);
                  // }
                  getSearchWord(strfArr[index].type);
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      ) : null}

      {/* 검색 결과 */}
      <ul className="px-[32px] py-[30px] flex flex-col gap-[30px]">
        {listArr?.length > 0 ? (
          listArr?.map((item, index) => {
            return (
              <li
                className="flex gap-[20px] items-center cursor-pointer"
                key={item.strfId}
                onClick={() => {
                  navigateContent(item.strfId);
                }}
              >
                {/* 썸네일 */}
                <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px]">
                  <img
                    src={`${ProductPic}${item.strfId}/${item.picTitle}`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 정보 */}
                <div className="flex flex-col gap-[5px]">
                  {/* 제목, 지역 제휴 */}
                  <div className="flex gap-[5px] items-center ">
                    <h3 className="text-[20px] font-semibold text-slate-700">
                      {item.title}
                    </h3>
                    {/* <div className="h-[14px] px-[5px] py-[3px] bg-[#FDB4A1] bg-opacity-50 text-secondary3_3 text-[8px] font-semibold flex items-center justify-center line-height-[100%]">
                      지역 제휴
                    </div> */}
                  </div>
                  {/* 카테고리, 지역 */}
                  <div className="flex gap-[5px] items-center">
                    {/* <p className="text-[14px] text-slate-500">{data.category}</p> */}
                    {/* <p className="text-[14px] text-slate-500">|</p>
                  <p className="text-[14px] text-slate-500">지역</p> */}
                  </div>
                  {/* 별점 */}
                  <div className="flex gap-[5px] items-center">
                    <Rate
                      disabled
                      count={1}
                      value={item.ratingIn ? 1 : 0}
                      style={{ fontSize: "16px" }}
                    />
                    <p className="text-[12px] text-slate-500">
                      {item.averageRating}
                    </p>
                    <p className="text-[12px] text-slate-500">
                      ({item.ratingCnt.toLocaleString()})
                    </p>
                  </div>
                  {/* 찜하기 */}
                  <div className="flex gap-[5px] items-center">
                    <div>
                      {item.wishIn ? (
                        <AiFillHeart className="text-secondary3 text-[16px]" />
                      ) : (
                        <AiOutlineHeart className="text-slate-400 text-[16px]" />
                      )}
                    </div>
                    <p className="text-[12px] text-slate-500">
                      {item.wishCnt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="flex gap-[20px] items-center cursor-pointer">
            {/* 썸네일 */}
            <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px]">
              <img
                src="public/images/logo_icon_4.png"
                alt="thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            {/* 정보 */}
            <div className="flex flex-col gap-[5px]">
              {/* 제목, 지역 제휴 */}
              <div className="flex gap-[5px] items-center ">
                <h3 className="text-[20px] font-semibold text-slate-700">
                  검색 결과가 없습니다.
                </h3>
                {/* <div className="h-[14px] px-[5px] py-[3px] bg-[#FDB4A1] bg-opacity-50 text-secondary3_3 text-[8px] font-semibold flex items-center justify-center line-height-[100%]">
                      지역 제휴
                    </div> */}
              </div>
              {/* 카테고리, 지역 */}
              <div className="flex gap-[5px] items-center">
                {/* <p className="text-[14px] text-slate-500">{data.category}</p> */}
                {/* <p className="text-[14px] text-slate-500">|</p>
                  <p className="text-[14px] text-slate-500">지역</p> */}
              </div>
              {/* 별점 */}
              <div className="flex gap-[5px] items-center">
                <Rate disabled count={1} value={0} />
                <p className="text-[12px] text-slate-500">
                  {/* {item.averageRating} */}
                </p>
                <p className="text-[12px] text-slate-500">
                  {/* ({item.ratingCnt.toLocaleString()}) */}
                </p>
              </div>
              {/* 찜하기 */}
              <div className="flex gap-[5px] items-center">
                <div>
                  <AiOutlineHeart className="text-slate-400" />
                </div>
                <p className="text-[12px] text-slate-500">
                  {/* {item.wishCnt.toLocaleString()} */}
                </p>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};
export default SearchTrip;
