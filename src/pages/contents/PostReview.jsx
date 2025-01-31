import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { Rate } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRecoilValue } from "recoil";
import { userAtom } from "../../atoms/userAtom";

const filesSchema = yup.object({
  imgfiles: yup
    .mixed()
    .test("fileCount", "최대 3개의 파일만 업로드 가능합니다.", value => {
      return value && value.length <= 20;
    })
    // .test("filesize", "파일 크기는 2MB 이하만 가능합니다.", value => {
    //   // 파일이 여러개 이므로 각 파일을 반복문으로 용량을 비교해야 함.
    //   return (
    //     // 파일들이 있다면 && 모든 파일들을 배열로서 변환하고, every 즉, 조건이 맞는지 반복해서 비교한다.
    //     // every 는 모두 true인 경우만 true 를 리턴한다. 하나라도 false 면 false 리턴
    //     value && Array.from(value).every(file => file.size <= 2 * 1024 * 1024)
    //   );
    // })
    .test("fileType", "JPG 또는 PNG 파일만 업로드 가능합니다.", value => {
      // 파일이 1개가 아니고 여러개이므로 반복문으로 type 비교를 해야 함.
      return (
        value &&
        Array.from(value).every(file =>
          ["image/jpeg", "image/png"].includes(file.type),
        )
      );
    }),
});

const PostReview = () => {
  //recoil
  const { userId } = useRecoilValue(userAtom);
  //쿼리스트링
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");

  // useNavigate
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state;
  //   console.log(locationState);
  //useState
  const [text, setText] = useState("");
  const [value, setValue] = useState(0); //Rate
  const [files, setFiles] = useState({});
  const [formData, setFormData] = useState({});
  useEffect(() => {
    setFormData({ ...formData, rating: value });
  }, [value]);
  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);
  //textarea
  const onChange = e => {
    // setText(e.target.value);
    setFormData({ ...formData, content: e.target.value });
  };
  //react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(filesSchema),
  });

  const handleSubmitForm = data => {
    console.log("사진 제출", data);
    //원래 배열이기 때문에
    const fileList = data.imgfiles;
    const fileArr = Array.from(fileList);
    setFiles(fileArr);
    console.log(fileArr);
    console.log(fileList);
  };

  //postReview
  const postReview = async () => {
    const postData = new FormData();
    postData.append(
      "p",
      new Blob(
        [JSON.stringify({ ...formData, userId: userId, strfId: strfId })],
        { type: "application/json" },
      ),
    );
    if (files) {
      postData.append("pics", files);
    }
    console.log("보낼 데이터:", postData);
    try {
      const res = await axios.post(`${USER.signUpUser}`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("회원가입 시도:", res.data);
      handleNavigateNext(locationState);
    } catch (error) {
      console.log("회원가입 시도:", error);
    }
  };

  return (
    <div>
      <TitleHeader title={locationState?.strfTitle} icon="back" />
      <div className="mt-[110px]">
        {/* 별점 */}
        <div>
          <Rate
            count={5}
            value={value}
            style={{ fontSize: 54 }}
            onChange={val => setValue(val)}
          />
          <p>별점을 선택해주세요</p>
        </div>
        {/* 리뷰 */}
        <div>
          <h3>리뷰를 남겨주세요.</h3>
          <TextArea
            maxLength={100}
            onChange={onChange}
            placeholder="직접 경험한 솔직한 리뷰를 남겨주세요."
            variant="filled"
            style={{
              height: 300,
              resize: "none",
            }}
            className="placeholder: text-[20px] placeholder: text-slate-400"
          />
        </div>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          {/* 사진 첨부 */}
          <div
            className="w-full h-[160px]
                      flex items-center gap-[20px]"
          >
            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              name="imgfiles"
              id="imgfiles"
              {...register("imgfiles")}
              multiple
              accept="image/png, image/jpeg"
              className="hidden"
            />
            {/* 커스텀 버튼 */}
            <label
              htmlFor="imgfiles"
              className="
            px-[50px] py-[50px]
            flex items-center justify-center
            bg-slate-100 rounded-lg
            hover:bg-[#e9eef3]
            transition duration-300
            cursor-pointer shrink-0"
            >
              <AiOutlinePlus size={36} className="text-slate-400" />
            </label>
            <p>{errors.imgfiles?.message}</p>
          </div>
          {/* 제출 버튼 */}
          <button type="submit">제출</button>
          <button type="button">확인</button>
        </form>
      </div>
    </div>
  );
};
export default PostReview;
