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
import { Button, Input, Rate } from "antd";
import { FiSearch } from "react-icons/fi";
import SearchItems from "../../components/search/SearchItems";
import { AiFillHeart, AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { getCookie } from "../../utils/cookie";
import { ProductPic } from "../../constants/pic";
import Loading from "../../components/loading/Loading";

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
  const [basicLastIndex, setBasicLastIndex] = useState(0);
  const [searchLastIndex, setSearchLastIndex] = useState(0);
  const [wordLastIndex, setWordLastIndex] = useState(0);
  const [searchData, setSearchData] = useState([]);
  const [searchState, setSearchState] = useState(false); // 검색 전, 후 구분
  const [inputValue, setInputValue] = useState(""); //검색 중 반영

  const [searchValue, setSearchValue] = useState(""); // 검색
  const [selectedCate, setSelectedCate] = useState(0);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMore, setIsMore] = useState(true);
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
    try {
      const res = await jwtAxios.get(
        `/api/search/strf-list-basic?trip_id=${tripId}&last_index=${basicLastIndex}`,
      );
      const resultData = res.data;
      // console.log("결과-입력 전:", resultData);
      setSearchData([...searchData, ...resultData.data.list]);
      if (resultData) {
        setIsLoading(true);
        setBasicLastIndex(prev => prev + 10);
      }
    } catch (error) {
      console.log("결과-입력 전:", error);
    }
  };
  //검색 결과 입력 후
  const getSearchWord = async (cate = null) => {
    try {
      const res = await jwtAxios.get(
        `/api/search/strf-list-word?trip_id=${tripId}&last_index=${searchLastIndex}&category=${category}&search_word=${searchValue}`,
      );
      const resultData = res.data;
      // console.log("결과-입력 후:", resultData);
      setSearchData([...searchData, ...resultData.data.list]);
      if (resultData) {
        setIsLoading(true);
        setSearchLastIndex(prev => prev + 10);
      }
    } catch (error) {
      console.log("결과-입력 후:", error);
    }
  };

  useEffect(() => {
    getSearchBasic();
  }, []);
  useEffect(() => {
    if (category !== null) {
      getSearchWord();
    }
  }, [category]);
  //리스트 배열
  const listArr = searchData?.list;

  // Input
  const onChange = e => {};

  return (
    <div className="w-full flex flex-col gap-[30px]">
      {isLoading ? (
        <>
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

          <ul className="flex gap-[10px] px-[32px] justify-between items-center">
            {strfArr.map((item, index) => {
              return (
                <li
                  key={index}
                  className={`cursor-pointer font-semibold text-[16px] w-[124px] flex justify-center items-center px-[15px] py-[10px] gap-[10px] rounded-[8px] ${index === selectedCate ? "bg-primary text-white" : "bg-white text-slate-500"}`}
                  onClick={() => {
                    setSelectedCate(index);
                    getSearchWord(strfArr[index].type);
                    setCategory(strfArr[index].name);
                  }}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>

          {/* 검색 결과 */}
          <ul className="px-[32px] py-[30px] flex flex-col gap-[30px]">
            {searchData?.length > 0 ? (
              searchData?.map((item, index) => {
                return (
                  <li
                    className="flex gap-[20px] items-center cursor-pointer"
                    key={index}
                    onClick={() => {
                      navigateContent(item.strfId);
                    }}
                  >
                    {/* 썸네일 */}
                    <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px] overflow-hidden">
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
                        {/* <p className="text-[14px] text-slate-500">{item.category}</p> */}
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
                <div className="w-[130px] h-[130px] bg-slate-200 rounded-[8px]"></div>
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
        </>
      ) : (
        <Loading />
      )}

      <Button
        onClick={() => {
          if (searchValue !== "") {
            getSearchWord();
          } else {
            getSearchBasic();
          }
        }}
        className="mb-[30px]"
      >
        더보기
      </Button>
    </div>
  );
};
export default SearchTrip;
