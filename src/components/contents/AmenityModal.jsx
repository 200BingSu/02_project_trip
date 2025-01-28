import { IoIosClose } from "react-icons/io";

const AmenityModal = ({ handleCancel, amenities }) => {
  return (
    <div
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white
w-[768px] h-[506px]
"
    >
      <div className="custom-modal-header flex gap-[40px] px-[32px] items-center mb-[20px]">
        <div className="custom-close-icon" onClick={handleCancel}>
          <IoIosClose className="text-[35px]" />
        </div>
        <div className="custom-title font-bold text-[24px] text-slate-700">
          편의시설 및 서비스
        </div>
      </div>
      <ul className="flex flex-wrap gap-[30px] vertical-gap-[20px]">
        {amenities.map(item => (
          <li
            key={item.key}
            className="flex flex-col gap-[10px] items-center justify-center w-[100px] h-[100px]"
          >
            <div>{item.icon}</div>
            <p>{item.key}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AmenityModal;
