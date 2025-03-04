import TitleHeaderTs from "../layout/header/TitleHeaderTs";

interface SearchFilterProps {
  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
  setOrderType: React.Dispatch<React.SetStateAction<string>>;
}

const SearchFilter = ({
  setShowFilter,
  setOrderType,
}: SearchFilterProps): JSX.Element => {
  return (
    <div className="max-w-[768px] w-full h-screen fixed top-0 left-1/2 -translate-x-1/2 bg-white z-10">
      <TitleHeaderTs
        icon=""
        title="필터"
        onClick={() => setShowFilter(false)}
      />

      <dl className="text-slate-700 py-6 px-4">
        <dt className="text-base font-semibold py-2">정렬</dt>
        <dd
          className="text-sm py-3 border-b-[1px] border-slate-100 cursor-pointer"
          onClick={() => {
            setOrderType("ratingAvg");
            setShowFilter(false);
          }}
        >
          평점순
        </dd>
        <dd
          className="text-sm py-3 border-b-[1px] border-slate-100 cursor-pointer"
          onClick={() => {
            setOrderType("ratingCnt");
            setShowFilter(false);
          }}
        >
          리뷰순
        </dd>
        <dd
          className="text-sm py-3 cursor-pointer"
          onClick={() => {
            setOrderType("likeCnt");
            setShowFilter(false);
          }}
        >
          좋아요순
        </dd>
      </dl>
    </div>
  );
};

export default SearchFilter;
