import { useRecoilState } from "recoil";
import { userAtom } from "../../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TitleHeader from "../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../constants/pic";
import { useNavigate } from "react-router-dom";
import { BiSolidCamera } from "react-icons/bi";
import { Button, Input, message, Typography } from "antd";
import { IoCloseCircleSharp } from "react-icons/io5";

const UserEdit = () => {
  const [userInfo, setUserInfo] = useRecoilState(userAtom);
  const [useProfile, setUseProfile] = useState({
    name: "",
    email: "",
    profilePic: "",
  });
  const [preview, setPreview] = useState("/images/user.png");
  // 처음에 보여주는 이미지로서 서버에서 이미지를 가져옮
  const [originImg, setOriginImg] = useState(null);

  const [file, setFile] = useState(null);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      });
      setUseProfile(res.data.data);
      setNewName(res.data.data.name);
      // 새로운 이미지로 교체
      setPreview(res.data.data.profilePic);
      // 처음에 화면에 보일때 API 호출 후 최초 오리지널 이미지를 경로로 담는다.
      setOriginImg(
        `${ProfilePic}${userInfo.userId}/${res.data.data.profilePic}`,
      );
      console.log("res.data", res.data.data.profilePic);
      // console.log("setPreview", setPreview);
    } catch (error) {
      console.log(error);
    }
  };

  const corUserInfo = async () => {
    if (!file && newName === useProfile.name) {
      message.warning("수정된 내용이 없습니다.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("profilePic", file);
    // console.log("useProfile.email ", useProfile.email);
    // console.log("newName ", newName);

    const requestData = {
      email: useProfile.email,
      name: newName,
    };
    // console.log("requestData ", requestData);
    // console.log("userInfo.accessToken ", userInfo.accessToken);
    // JSON 데이터를 FormData에 추가
    formData.append(
      "p",
      new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      }),
    );

    try {
      const res = await axios.patch(`/api/user`, formData, {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("프로필이 수정되었습니다.");
      getUserInfo();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    console.log("selectedFile : ", selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      console.log("objectUrl : ", objectUrl);
      setPreview(objectUrl);
      // 새로운 이미지를 선택했으므로 원래 이미지는 없는 것 처럼 처리한다.
      setOriginImg(null);
    }
  };

  useEffect(() => {
    console.log("Updated preview:", preview);
  }, [preview]);

  useEffect(() => {
    getUserInfo();
  }, []);

  console.log("originImg", originImg);

  return (
    <div>
      <TitleHeader
        icon={""}
        title={"프로필 설정"}
        onClick={() => navigate(-1)}
      />
      <div className="flex flex-col gap-10">
        <div className="mt-16 ">
          <div className="relative">
            <div className="mx-auto w-32 h-32 rounded-full overflow-hidden">
              <img
                src={originImg ? originImg : preview}
                alt="User-Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <label
              htmlFor="userImg"
              className="flex bg-primary w-9 h-9 justify-center items-center rounded-full absolute bottom-0 right-80 cursor-pointer"
            >
              <BiSolidCamera className="text-lg text-white" />
              <input
                type="file"
                accept="image/*"
                id="userImg"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        <div>
          <Typography.Title
            className="
      !text-lg !font-semibold !text-slate-700 !mb-2 !ml-1"
          >
            닉네임
          </Typography.Title>
          <Input
            placeholder="닉네임을 입력해 주세요."
            className="rounded-lg text-lg text-slate-700 px-5 py-4"
            allowClear={{
              clearIcon: (
                <IoCloseCircleSharp className="text-2xl text-slate-300 duration-300 hover:text-slate-600" />
              ),
            }}
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full h-16 text-xl font-medium text-white rounded-lg"
          onClick={corUserInfo}
        >
          완료
        </Button>
      </div>
    </div>
  );
};

export default UserEdit;
