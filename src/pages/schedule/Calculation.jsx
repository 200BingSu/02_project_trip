import React from "react";
import TitleHeader from "../../components/layout/header/TitleHeader";

const Calculation = () => {
  return (
    <div>
      <TitleHeader
        icon={"back"}
        title={"가계부"}
        onClick={() => navigate(-1)}
      />
      <div className="flex flex-col gap-8 mt-24 px-8">
        <h1 className="flex items-end gap-3">
          <h2 className="text-4xl text-slate-700 font-bold">가평여행</h2>
          <span className="text-lg text-slate-400">2025.01.25 ~ 01.27</span>
        </h1>
        <div>
          <h3 className="text-2xl text-slate-700">내가 쓴 금액</h3>
          <h2 className="text-4xl font-semibold text-primary">821,017원</h2>
        </div>
        <div className="flex items-center py-8 border-b border-slate-100">
          <div className="mr-auto">
            <p className="text-2xl font-semibold text-slate-700">
              온정리 닭갈비 금강막국수 본점
            </p>
            <span className="text-base text-slate-400">
              나, 닉네임1, 닉네임2,닉네임3
            </span>
          </div>
          <p className="text-2xl font-semibold text-primary">159,500원</p>
        </div>
        <button>비용 추가</button>
      </div>
      <div>
        <h1>
          총 지출액 <span>129,600</span>원
        </h1>
      </div>
    </div>
  );
};

export default Calculation;
