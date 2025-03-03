import { Select, TimePicker, Upload, UploadFile } from "antd";
import ImgCrop from "antd-img-crop";
import dayjs from "dayjs";
import { memo, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import { StepRef } from "../../../pages/business/register/RegisterIndex";
import TextArea from "antd/es/input/TextArea";
const { RangePicker } = TimePicker;

const Step2 = ({
  picRef,
  businessHoursRef,
  checkTimeRef,
  holidayRef,
  bioRef,
}: StepRef): JSX.Element => {
  const [register, setRegister] = useRecoilState(registerAtom);

  // 파일 업로드
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    // Initialize fileList from register.image if it exists
    if (register.image && register.image.length > 0) {
      return register.image.map(item => ({
        uid: item.uid,
        name: item.name || "image.jpg",
        status: "done",
        url: item.originFileObj ? URL.createObjectURL(item.originFileObj) : "",
      }));
    }
    return [];
  });

  useEffect(() => {
    // Cleanup URLs when component unmounts
    return () => {
      fileList.forEach(file => {
        if (file.url && file.url.startsWith("blob:")) {
          URL.revokeObjectURL(file.url);
        }
      });
    };
  }, [fileList]);

  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
    setRegister(prev => ({
      ...prev,
      image: newFileList.map((file: UploadFile) => ({ ...file })),
    }));
  };
  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  // 휴무일
  const scheduleOptions = {
    frequency: [
      { label: "없음", value: "" },
      { label: "매주", value: "weekly" },
      { label: "격주", value: "biweekly" },
    ],
    day: [
      { label: "월", value: "mon" },
      { label: "화", value: "tue" },
      { label: "수", value: "wed" },
      { label: "목", value: "thu" },
      { label: "금", value: "fri" },
      { label: "토", value: "sat" },
      { label: "일", value: "sun" },
    ],
  };
  return (
    <div>
      <div className="flex flex-col gap-5">
        {/* 폼 */}
        <section className="flex flex-col gap-3">
          <ul className="flex flex-col gap-10 py-5">
            {/* 업체 사진 */}
            <li className="flex flex-col gap-1" ref={picRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 업체 사진
              </h3>
              <p className="text-base text-slate-500">
                고객에게 보여지는 업체 이미지를 등록해주세요.
              </p>
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
                  beforeUpload={() => false}
                  accept="image/*"
                >
                  {fileList.length < 5 && "+ Upload"}
                </Upload>
              </ImgCrop>
            </li>
            {/* 영업시간 */}
            <li className="flex flex-col gap-1" ref={businessHoursRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 영업 시간
              </h3>
              <p className="text-base text-slate-500">
                업체의 영업시간을 입력해주세요.
              </p>
              <RangePicker
                placeholder={["영업 시작 시간", "영업 종료 시간"]}
                size="large"
                format="HH:mm"
                onChange={value => {
                  setRegister(prev => ({
                    ...prev,
                    businessHours: {
                      startTime: value?.[0]?.format("HH:mm") || "",
                      endTime: value?.[1]?.format("HH:mm") || "",
                    },
                  }));
                }}
                value={[
                  register.businessHours?.startTime
                    ? dayjs(register.businessHours?.startTime, "HH:mm")
                    : null,
                  register.businessHours?.endTime
                    ? dayjs(register.businessHours?.endTime, "HH:mm")
                    : null,
                ]}
              />
            </li>
            {/* 체크인, 체크아웃 시간 */}
            <li className="flex flex-col gap-1" ref={checkTimeRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                <i className="text-secondary3_3">*</i> 입실/퇴실 시간
              </h3>
              <p className="text-base text-slate-500">
                숙소의 입실 및 퇴실 시간을 입력해주세요.
              </p>
              <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                입실
                <TimePicker
                  placeholder="입실 시간을 지정해주세요"
                  size="large"
                  className="w-full"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      checkTime: {
                        ...prev.checkTime,
                        checkIn: value?.format("HH:mm") || "",
                      },
                    }));
                  }}
                  format="HH:mm"
                  value={
                    register.checkTime?.checkIn
                      ? dayjs(register.checkTime?.checkIn, "HH:mm")
                      : null
                  }
                />
              </label>
              <label className="text-sm text-slate-700 flex items-center gap-3 whitespace-nowrap w-full">
                퇴실
                <TimePicker
                  placeholder="퇴실 시간을 지정해주세요"
                  size="large"
                  className="w-full"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      checkTime: {
                        ...prev.checkTime,
                        checkOut: value?.format("HH:mm") || "",
                      },
                    }));
                  }}
                  format="HH:mm"
                  value={
                    register.checkTime?.checkOut
                      ? dayjs(register.checkTime?.checkOut, "HH:mm")
                      : null
                  }
                />
              </label>
            </li>
            {/* 휴일 */}
            <li className="flex flex-col gap-1" ref={holidayRef}>
              <h3 className="text-slate-700 text-lg font-semibold">휴무일</h3>
              <p className="text-base text-slate-500">
                정기 휴일이 있을 경우, 정기 휴무일을 작성해주세요.
              </p>
              <div className="flex gap-3">
                <Select
                  options={scheduleOptions.frequency}
                  placeholder="휴무 주기"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      holiday: { ...prev.holiday, frequency: value },
                    }));
                  }}
                  size="large"
                />
                <Select
                  options={scheduleOptions.day}
                  placeholder="요일 선택"
                  size="large"
                  mode="multiple"
                  allowClear
                  className="w-full"
                  onChange={value => {
                    setRegister(prev => ({
                      ...prev,
                      holiday: { ...prev.holiday, day: value },
                    }));
                  }}
                />
              </div>
            </li>
            {/* 업체 소개 */}
            <li className="flex flex-col gap-1" ref={bioRef}>
              <h3 className="text-slate-700 text-lg font-semibold">
                업체 소개
              </h3>
              <p className="text-base text-slate-500">
                고객에게 보여지는 업체의 소개를 작성해주세요.
              </p>
              <TextArea
                placeholder="업체 소개를 작성해주세요"
                maxLength={50}
                onChange={e => {
                  setRegister(prev => ({ ...prev, bio: e.target.value }));
                }}
                style={{ resize: "none", height: "27.73vw" }}
                value={register.bio}
              />
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default memo(Step2);
