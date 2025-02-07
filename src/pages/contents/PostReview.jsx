// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import TitleHeader from "../../components/layout/header/TitleHeader";
// import { Button, Rate } from "antd";
// import TextArea from "antd/es/input/TextArea";
// import { useEffect, useState } from "react";
// import { AiOutlinePlus } from "react-icons/ai";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useRecoilValue } from "recoil";
// import { userAtom } from "../../atoms/userAtom";
// import { REVIEW } from "../../constants/api";
// import axios from "axios";

// const filesSchema = yup.object({
//   imgfiles: yup
//     .mixed()
//     .test("fileCount", "최대 20개의 파일만 업로드 가능합니다.", value => {
//       return value && value.length <= 20;
//     })
//     .test("filesize", "파일 크기는 2MB 이하만 가능합니다.", value => {
//       // 파일이 여러개 이므로 각 파일을 반복문으로 용량을 비교해야 함.
//       return (
//         // 파일들이 있다면 && 모든 파일들을 배열로서 변환하고, every 즉, 조건이 맞는지 반복해서 비교한다.
//         // every 는 모두 true인 경우만 true 를 리턴한다. 하나라도 false 면 false 리턴
//         value && Array.from(value).every(file => file.size <= 2 * 1024 * 1024)
//       );
//     })
//     .test("fileType", "JPG 또는 PNG 파일만 업로드 가능합니다.", value => {
//       // 파일이 1개가 아니고 여러개이므로 반복문으로 type 비교를 해야 함.
//       return (
//         value &&
//         Array.from(value).every(file =>
//           ["image/jpeg", "image/png"].includes(file.type),
//         )
//       );
//     }),
// });

// const PostReview = () => {
//   //recoil
//   const { userId, accessToken } = useRecoilValue(userAtom);
//   //쿼리스트링
//   const [searchParams] = useSearchParams();
//   const strfId = parseInt(searchParams.get("strfId"));

//   // useNavigate
//   const navigate = useNavigate();
//   const navigateBack = () => {
//     navigate(-1);
//   };
//   const location = useLocation();
//   const locationState = location.state;
//   //   console.log(locationState);
//   //useState
//   const [text, setText] = useState("");
//   const [value, setValue] = useState(0); //Rate
//   const [files, setFiles] = useState([]);
//   const [formData, setFormData] = useState({});
//   useEffect(() => {
//     setFormData({ ...formData, rating: value });
//   }, [value]);
//   useEffect(() => {
//     console.log("업데이트된 files:", files);
//   }, [files]);
//   useEffect(() => {
//     console.log("formData", formData);
//   }, [formData]);
//   //textarea
//   const onChange = e => {
//     // setText(e.target.value);
//     setFormData({ ...formData, content: e.target.value });
//   };
//   //react-hook-form
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(filesSchema),
//   });

//   const handleSubmitForm = data => {
//     console.log("사진 제출", data);
//     //원래 배열이기 때문에
//     const fileList = data.imgfiles;
//     const fileArr = Array.from(fileList);
//     setFiles(fileArr);
//     console.log(fileArr);
//     console.log(fileList);
//   };

//   //postReview
//   const postReview = async () => {
//     const pData = { ...formData, userId: userId, strfId: strfId };
//     console.log("p", pData);
//     console.log("JSON인 p", JSON.stringify(pData));
//     const postData = new FormData();
//     postData.append(
//       "p",
//       new Blob([JSON.stringify(pData)], { type: "application/json" }),
//     );
//     //postData.append("p", JSON.stringify(pData));
//     if (files.length > 0) {
//       files.forEach(file => postData.append("pics", file));
//     }
//     console.log("보낼 데이터:", [...postData]);
//     try {
//       const res = await axios.post(`${REVIEW.postReview}`, postData, {
//         headers: {
//           // "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//       console.log("리뷰 등록:", res.data);
//     } catch (error) {
//       if (error.response) {
//         console.error("서버 오류 응답:", error.response.data); // 서버가 반환한 오류 메시지
//         console.error("서버 상태 코드:", error.response.status); // 상태 코드
//         console.error("서버 헤더:", error.response.headers); // 헤더 정보
//       } else {
//         console.error("리뷰 등록 실패:", error.message); // 요청을 보낼 때 발생한 오류
//       }
//     }
//   };

//   return (
//     <div>
//       <TitleHeader
//         title={locationState?.strfTitle}
//         icon="back"
//         onClick={navigateBack}
//       />
//       <div className="mt-[110px]">
//         {/* 별점 */}
//         <div>
//           <Rate
//             count={5}
//             value={value}
//             style={{ fontSize: 54 }}
//             onChange={val => setValue(val)}
//           />
//           <p>별점을 선택해주세요</p>
//         </div>
//         {/* 리뷰 */}
//         <div>
//           <h3>리뷰를 남겨주세요.</h3>
//           <TextArea
//             maxLength={100}
//             onChange={onChange}
//             placeholder="직접 경험한 솔직한 리뷰를 남겨주세요."
//             variant="filled"
//             style={{
//               height: 300,
//               resize: "none",
//             }}
//             className="placeholder: text-[20px] placeholder: text-slate-400"
//           />
//         </div>
//         <form onSubmit={handleSubmit(handleSubmitForm)}>
//           {/* 사진 첨부 */}
//           <div
//             className="w-full h-[160px]
//                       flex items-center gap-[20px]"
//           >
//             {/* 숨겨진 파일 입력 */}
//             <input
//               type="file"
//               name="imgfiles"
//               id="imgfiles"
//               {...register("imgfiles")}
//               multiple
//               accept="image/png, image/jpeg"
//               className="hidden"
//             />
//             {/* 커스텀 버튼 */}
//             <label
//               htmlFor="imgfiles"
//               className="
//             px-[50px] py-[50px]
//             flex items-center justify-center
//             bg-slate-100 rounded-lg
//             hover:bg-[#e9eef3]
//             transition duration-300
//             cursor-pointer shrink-0"
//             >
//               <AiOutlinePlus size={36} className="text-slate-400" />
//             </label>
//             <p>에러메세지:{errors.imgfiles?.message}</p>
//           </div>
//           {/* 제출 버튼 */}
//           <button type="submit">제출</button>
//           <Button type="primary" htmltype="button" onClick={postReview}>
//             확인
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// };
// export default PostReview;

import React, { useEffect, useState } from "react";
import { Form, Rate, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { REVIEW } from "../../constants/api";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { useNavigate, useSearchParams } from "react-router-dom";
import jwtAxios from "../../apis/jwt";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { getCookie } from "../../utils/cookie";

const PostReview = () => {
  const accessToken = getCookie("accessToken");
  // recoil
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  //useNavigate
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const [form] = Form.useForm();
  //useState
  const [fileList, setFileList] = useState([]);
  //쿼리스트링
  const [searchParmas] = useSearchParams();
  const strfId = searchParmas.get("strfId");
  // 파일 업로드 핸들러
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // 폼 제출 핸들러
  const onFinish = async values => {
    const { content, file, rating, strfId, userId } = values;
    const pData = {
      userId: parseInt(userId),
      strfId: parseInt(strfId),
      rating: parseInt(rating),
      content: content,
    };
    const formData = new FormData();
    setFileList(file.fileList);
    formData.append(
      "p",
      new Blob([JSON.stringify(pData)], { type: "application/json" }),
    );
    console.log(values);
    console.log(fileList);
    // const formData = new FormData();
    // formData.append("rating", values.rating);
    // formData.append("comment", values.comment);

    // // 파일이 있으면 폼 데이터에 추가
    if (file && file.fileList && file.fileList.length > 0) {
      // file.fileList 배열을 순회하며 각 파일을 formData에 append
      file.fileList.forEach(fileItem => {
        formData.append("pics", fileItem.originFileObj);
      });
    }

    const blob = formData.get("p");
    if (blob) {
      blob.text().then(text => console.log("p의 내용:", text));
    }
    console.log("보낸 데이터", [...formData]);
    try {
      const response = await axios.post(`${REVIEW.postReview}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <TitleHeader icon="back" onClick={navigateBack} />
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ userId: userInfo.userId, strfId: strfId }}
      >
        <Form.Item label="userId" name="userId">
          <Input value={userInfo.userId} />
        </Form.Item>
        <Form.Item label="strfId" name="strfId">
          <Input value={strfId} />
        </Form.Item>
        <Form.Item label="rating" name="rating">
          <Rate />
        </Form.Item>

        <Form.Item label="content" name="content">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Upload" name="file">
          <Upload
            listType="picture"
            beforeUpload={() => false} // 파일 자동 업로드 방지
            fileList={fileList}
            onChange={handleChange}
            multiple
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PostReview;
