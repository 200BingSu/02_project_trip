import { Upload, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { registerAtom } from "../../../atoms/registerAtom";
import { StepRef } from "../../../pages/business/register/RegisterIndex";

const Step3 = ({ picRef, bioRef }: StepRef): JSX.Element => {
  // recoil
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
  return (
    <div className="flex flex-col gap-5">
      {/* 폼 */}
      <section>
        <ul className="flex flex-col gap-10 py-5">
          {/* 업체 사진 */}
          <li className="flex flex-col gap-1" ref={picRef}>
            <h3 className="text-slate-700 text-lg font-semibold">
              <i className="text-secondary3_3">*</i> 업체 사진
            </h3>
            <p className="text-base text-slate-500">
              고객에게 보여지는 업체 이미지를 등록해주세요.
            </p>

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
          </li>
          {/* 업체 소개 */}
          <li className="flex flex-col gap-1" ref={bioRef}>
            <h3 className="text-slate-700 text-lg font-semibold">업체 소개</h3>
            <p className="text-base text-slate-500">
              고객에게 보여지는 업체의 소개를 작성해주세요.
            </p>
            <TextArea
              placeholder="업체 소개를 작성해주세요"
              maxLength={50}
              onChange={e => {
                setRegister(prev => ({ ...prev, bio: e.target.value }));
              }}
              style={{ resize: "none", height: "27.73vw", padding: "20px" }}
              value={register.bio}
            />
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Step3;
