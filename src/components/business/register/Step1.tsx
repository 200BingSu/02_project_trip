import { Button, Input, Select } from "antd";
import axios from "axios";
import { memo, useEffect, useState } from "react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import { koreaAreaCodes } from "../../../constants/koreaAreaCode";
import { CATEGORY_LIST, ICategory } from "../../../constants/register";
import { StepRef } from "../../../pages/business/register/RegisterIndex";
import { Documents, Meta } from "../../../types/kakao";

const { Option } = Select;

export interface IGetGeoCode {
  meta: Meta;
  documents: Documents[];
}

const Step1 = ({ categoryRef, nameRef, locationRef, tellRef }: StepRef) => {
  const [register, setRegister] = useRecoilState(registerAtom);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState<boolean>(false);

  // 카테고리 선택
  const handleCategory = (item: ICategory) => {
    setRegister(prev => ({ ...prev, category: item.category }));
  };
  // 우편 번호 및 주소
  useEffect(() => {
    // Daum 우편번호 스크립트 로드
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  // 우편번호 검색
  const handleComplete = (data: any) => {
    console.log("data", data);
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    console.log(fullAddress); // e.g. '서울 성동구 왕십리로2길 20 (성수동1가)'
    getGeoCode(fullAddress);
    setRegister(prev => ({
      ...prev,
      locationTitle: data.sido,
      location: {
        postcode: data.zonecode,
        address: fullAddress,
      },
    }));
  };

  // 전화번호
  const selectBefore = (
    <Select
      defaultValue="053"
      onChange={e =>
        setRegister(prev => ({
          ...prev,
          tell: { ...prev.tell, areaCode: e },
        }))
      }
    >
      {koreaAreaCodes.map(item => {
        return (
          <Option key={item.code} value={item.code}>
            {item.code}
          </Option>
        );
      })}
    </Select>
  );
  // 전화번호 포멧
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");
    // 7자리까지만 허용
    const trimmed = numbers.slice(0, 7);
    // 000-0000 형식으로 변환
    if (trimmed.length > 3) {
      return `${trimmed.slice(0, 3)}-${trimmed.slice(3)}`;
    }
    return trimmed;
  };
  // 카카오 REST API
  const getGeoCode = async (address: string): Promise<IGetGeoCode | null> => {
    const url = "https://dapi.kakao.com/v2/local/search/address";
    try {
      const res = await axios.get<IGetGeoCode>(`${url}?query=${address}`, {
        headers: {
          Authorization: `KakaoAK ${import.meta.env.VITE_KKO_REST_API_KEY}`,
        },
      });
      console.log("좌표", res.data.documents[0]);
      setRegister(prev => ({
        ...prev,

        location: {
          ...prev.location,
          latitude: Number(res.data.documents[0].y),
          longitude: Number(res.data.documents[0].x),
        },
      }));
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log("error", error);
      return null;
    }
  };
  // 상세 주소 작성
  const handleAddressDetail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegister(prev => ({
      ...prev,
      location: { ...prev.location, addressDetail: e.target.value },
    }));
  };
  const handleBlurAddressDetail = async () => {
    const address = `${register.location?.address} ${register.location?.addressDetail}`;
    await getGeoCode(address);
  };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {/* 폼 */}
        <section className="flex flex-col gap-3">
          <ul className="flex flex-col gap-10 py-5">
            {/* 카테고리 */}
            <li className="flex flex-col gap-1" ref={categoryRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 업체의 카테고리를
                선택해주세요
              </h3>
              <div className="flex items-center gap-3 px-3 py-2">
                {CATEGORY_LIST.map((item, index) => {
                  return (
                    <button
                      key={index}
                      type="button"
                      className={`flex items-center gap-2 px-[10px] py-[5px] rounded-2xl border ${
                        register.category === item.category
                          ? "border-primary"
                          : "border-slate-300"
                      } transition-all duration-300`}
                      onClick={() => handleCategory(item)}
                    >
                      <i className="w-4 object-contain">
                        <img
                          src={item.emoji}
                          alt={item.name}
                          className="w-full h-full"
                        />
                      </i>
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </li>
            {/* 업체 이름 */}
            <li className="flex flex-col gap-1" ref={nameRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 업체 이름
              </h3>
              <p className="text-base text-slate-500">
                고객에게 보여지는 이름입니다.
              </p>
              <Input
                size="large"
                placeholder="업체 이름을 입력해주세요"
                onChange={e =>
                  setRegister(prev => ({ ...prev, name: e.target.value }))
                }
                value={register.name}
              />
            </li>
            {/* 업체 주소 */}
            <li className="flex flex-col gap-1" ref={locationRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 업체 주소
              </h3>
              <p className="text-base text-slate-500">
                고객이 방문할 수 있는 주소를 적어주세요.
              </p>
              <div className="flex items-center gap-3 w-full justify-between">
                <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                  우편번호
                  <Input
                    size="large"
                    placeholder="우편번호를 입력해주세요."
                    onChange={e =>
                      setRegister(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          postcode: e.target.value,
                        },
                      }))
                    }
                    className="w-full"
                    value={register.location?.postcode}
                  />
                </label>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => setIsPostcodeOpen(true)}
                >
                  검색
                </Button>
              </div>
              <label className="text-sm text-slate-700 flex items-center gap-9 whitespace-nowrap w-full">
                주소
                <Input
                  size="large"
                  placeholder="주소를 입력해주세요."
                  onChange={e =>
                    setRegister(prev => ({
                      ...prev,
                      location: { ...prev.location, address: e.target.value },
                    }))
                  }
                  className="w-full"
                  value={register.location?.address}
                />
              </label>
              <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                상세주소
                <Input
                  size="large"
                  placeholder="상세주소를 입력해주세요."
                  onChange={handleAddressDetail}
                  className="w-full"
                  value={register.location?.addressDetail}
                  onBlur={handleBlurAddressDetail}
                />
              </label>

              {isPostcodeOpen && (
                <DaumPostcodeEmbed
                  onComplete={handleComplete}
                  onClose={() => setIsPostcodeOpen(false)}
                />
              )}
            </li>
            {/* 업체 전화번호 */}
            <li className="flex flex-col gap-1" ref={tellRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 업체 전화번호
              </h3>
              <p className="text-base text-slate-500">
                고객이 전화를 할 수 있는 전화번호를 입력해주세요.
              </p>
              <Input
                addonBefore={selectBefore}
                size="large"
                placeholder="전화번호를 입력해주세요."
                onChange={e =>
                  setRegister(prev => ({
                    ...prev,
                    tell: { ...prev.tell, number: e.target.value },
                  }))
                }
                value={formatPhoneNumber(register.tell?.number || "")}
              />
              <p className="text-sm text-slate-400">
                ⁕ 집 또는 매장 전화 사용시 지역 번호를 포함해주세요.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default memo(Step1);
