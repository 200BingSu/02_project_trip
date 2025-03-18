import { FaQuestionCircle } from "react-icons/fa";

export const qnaData = [
  {
    key: "1",
    label: (
      <p className="text-lg font-semibold flex items-center gap-2 text-slate-700">
        <span className="text-primary text-2xl">
          <FaQuestionCircle />
        </span>
        숙소 예약 방법
      </p>
    ),
    children: (
      <div className="text-sm text-slate-600 py-5">
        숙소를 예약하려면 원하는 날짜와 지역을 선택한 후 검색을 진행하세요. 검색
        결과에서 원하는 숙소를 선택한 후 예약하기 버튼을 클릭하여 결제를
        완료하면 됩니다.
      </div>
    ),
  },
  {
    key: "2",
    label: (
      <p className="text-lg font-semibold flex items-center gap-2 text-slate-700">
        <span className="text-primary text-2xl">
          <FaQuestionCircle />
        </span>
        예약 취소 및 변경 방법
      </p>
    ),
    children: (
      <div className="text-sm text-slate-600 py-5">
        예약을 취소하거나 변경하려면 마이페이지에서 예약 내역을 확인한 후 취소
        또는 변경 버튼을 클릭하세요. 일부 숙소는 취소 수수료가 발생할 수 있으니
        유의하시기 바랍니다.
      </div>
    ),
  },
  {
    key: "3",
    label: (
      <p className="text-lg font-semibold flex items-center gap-2 text-slate-700">
        <span className="text-primary text-2xl">
          <FaQuestionCircle />
        </span>
        결제 방법
      </p>
    ),
    children: (
      <div className="text-sm text-slate-600 py-5">
        신용카드, 체크카드, 간편결제(카카오페이, 네이버페이 등)를 통해 결제가
        가능합니다. 결제 수단에 따라 할부 옵션이 제공될 수 있습니다.
      </div>
    ),
  },
  {
    key: "4",
    label: (
      <p className="text-lg font-semibold flex items-center gap-2 text-slate-700">
        <span className="text-primary text-2xl">
          <FaQuestionCircle />
        </span>
        체크인 및 체크아웃 시간
      </p>
    ),
    children: (
      <div className="text-sm text-slate-600 py-5">
        일반적으로 체크인은 오후 3시 이후, 체크아웃은 오전 11시까지입니다.
        숙소마다 시간이 다를 수 있으므로 예약 시 확인하시기 바랍니다.
      </div>
    ),
  },
  {
    key: "5",
    label: (
      <p className="text-lg font-semibold flex items-center gap-2 text-slate-700">
        <span className="text-primary text-2xl">
          <FaQuestionCircle />
        </span>
        반려동물 동반 가능 여부
      </p>
    ),
    children: (
      <div className="text-sm text-slate-600 py-5">
        일부 숙소는 반려동물 동반이 가능하지만, 추가 요금이 부과될 수 있습니다.
        예약 전 숙소의 반려동물 정책을 꼭 확인하세요.
      </div>
    ),
  },
  {
    key: "6",
    label: (
      <p className="text-lg font-semibold flex items-center gap-2 text-slate-700">
        <span className="text-primary text-2xl">
          <FaQuestionCircle />
        </span>
        글꼴이 왜 그런가요?
      </p>
    ),
    children: (
      <div className="text-sm text-slate-600 py-5">
        일부 숙소는 반려동물 동반이 가능하지만, 추가 요금이 부과될 수 있습니다.
        예약 전 숙소의 반려동물 정책을 꼭 확인하세요.
      </div>
    ),
  },
];
