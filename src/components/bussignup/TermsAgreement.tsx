import { Checkbox } from "antd";
import { useState, useEffect } from "react";

interface TermsAgreementProps {
  checkedList: string[];
  setCheckedList: (value: string[]) => void;
  setIsRequiredChecked: (value: boolean) => void;
}

const TermsAgreement = ({
  checkedList,
  setCheckedList,
  setIsRequiredChecked,
}: TermsAgreementProps): JSX.Element => {
  const plainOptions = [
    { label: "[필수] 서비스 이용약관", value: "required-1" },
    { label: "[필수] 개인정보 수집 및 이용", value: "required-2" },
    { label: "[필수] 위치서비스 이용", value: "required-3" },
    { label: "[선택] 이벤트 및 할인 혜택", value: "option" },
  ];

  const requiredOptions = plainOptions
    .filter(option => option.value.startsWith("required"))
    .map(option => option.value);

  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    setCheckAll(checkedList.length === plainOptions.length);
    // 필수 약관이 모두 체크되었는지 확인
    const isAllRequiredChecked = requiredOptions.every(required =>
      checkedList.includes(required),
    );
    setIsRequiredChecked(isAllRequiredChecked);
  }, [checkedList, setIsRequiredChecked]);

  const onCheckAllChange = (e: any) => {
    const checked = e.target.checked;
    setCheckAll(checked);
    setCheckedList(checked ? plainOptions.map(option => option.value) : []);
  };

  return (
    <>
      <Checkbox
        className="custom-all-checkbox bg-slate-50 w-full font-medium text-base py-5 px-3 rounded-lg mt-4 text-slate-700"
        checked={checkAll}
        onChange={onCheckAllChange}
      >
        전체 동의합니다.
      </Checkbox>
      <Checkbox.Group
        options={plainOptions}
        value={checkedList}
        onChange={setCheckedList}
        className="flex flex-col gap-2 w-full px-3 py-4"
      />
    </>
  );
};

export default TermsAgreement;
