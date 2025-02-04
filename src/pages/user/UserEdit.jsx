import { Button, Form, Input, Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiSolidCamera } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../constants/pic";

const UserEdit = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [profileImg, setProfileImg] = useState("/images/user.png");
  const [selectedFile, setSelectedFile] = useState(null);

  // useLocation
  const location = useLocation();
  const useProfile = location.state;
  console.log("왔음", useProfile);

  const updateInfoCorrect = async () => {
    try {
      const formData = new FormData();
      formData.append("profilePic", selectedFile); // ✅ 파일 추가

      // ✅ JSON 데이터를 문자열로 변환하여 FormData에 추가
      const userInfoJSON = JSON.stringify({
        email: useProfile.email,
        name: useProfile.name,
      });
      formData.append("p", userInfoJSON); // ✅ JSON 데이터를 문자열로 추가

      console.log("보낼 데이터:", formData);

      const res = await axios.patch(
        `/api/user`,
        formData, // ✅ JSON 데이터를 보냄
        {
          headers: {
            Authorization: `Bearer ${userInfo.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("응답 데이터:", res.data);

      setUserInfo(prev => ({
        ...prev,
        name: useProfile.name,
        email: useProfile.email,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedFile) {
      updateInfoCorrect();
    }
  }, []);

  const navigate = useNavigate();

  const handleChangeImg = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (profileImg) {
      URL.revokeObjectURL(profileImg);
    }

    const imageUrl = URL.createObjectURL(file);
    setProfileImg(imageUrl);
    setSelectedFile(file);
  };

  console.log(`${ProfilePic}${userInfo.userId}/${useProfile?.profilePIc}`);
  console.log(`${profileImg}`);

  return (
    <div>
      <TitleHeader
        icon={""}
        title={"프로필 설정"}
        onClick={() => navigate(-1)}
      />
      <div className="mt-14 flex flex-col items-center gap-10">
        <label htmlFor="user-img" className="relative">
          <i className="bg-primary  rounded-full absolute top-[8.4rem] left-[1.9rem] px-2 py-2 cursor-pointer">
            <BiSolidCamera className="text-lg text-white" />
          </i>
          <input
            type="file"
            name="profile-img"
            accept="image/*"
            onChange={handleChangeImg}
            className="hidden"
            id="user-img"
          />
        </label>

        <div>
          <p className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={
                useProfile.profilePIc
                  ? `${ProfilePic}${userInfo.userId}/${useProfile?.profilePIc}`
                  : `${profileImg}`
              }
              alt="User-Profile"
              className="h-full object-cover"
            />
          </p>
        </div>
        <div className="w-full h-full">
          <Form onFinish={() => updateInfoCorrect()}>
            <div>
              {/* 닉네임 */}
              <Form.Item
                layout="vertical"
                label="닉네임"
                labelCol={{
                  className:
                    "text-lg font-semibold text-slate-700 m-0 !ml-1 !pb-1",
                }} // Tailwind 스타일 적용
                name={useProfile.name}
                value={useProfile.name}
                className="h-20"
              >
                <Input
                  placeholder={useProfile.name}
                  className="h-16 rounded-lg text-lg  !placeholder-slate-700"
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                className="mt-10 w-full h-16 text-xl font-medium rounded-lg"
              >
                완료
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default UserEdit;
