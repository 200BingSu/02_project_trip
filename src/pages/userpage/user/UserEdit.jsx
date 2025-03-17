import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../../constants/pic";
import { useNavigate } from "react-router-dom";
import { BiSolidCamera } from "react-icons/bi";
import { Button, Input, message, Typography } from "antd";
import { IoCloseCircleSharp } from "react-icons/io5";
import { getCookie } from "../../../utils/cookie";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";

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

  const accessToken = getCookie("accessToken");
  const userLogin = getCookie("user");
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/api/user/userInfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUseProfile(res.data.data);
      setNewName(res.data.data.name);
      // 새로운 이미지로 교체
      setPreview(res.data.data.profilePic);
      // 처음에 화면에 보일때 API 호출 후 최초 오리지널 이미지를 경로로 담는다.
      setOriginImg(
        `${ProfilePic}/${userLogin.userId}/${res.data.data.profilePic}`,
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
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("프로필이 수정되었습니다.");
      getUserInfo();
      navigate(`/user/index`);
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
      <TitleHeaderTs
        title="프로필 설정"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <div className="flex flex-col gap-5 mt-5 py-3">
        <div>
          <div className="">
            <div className="mx-auto w-32 aspect-square   relative">
              <img
                src={originImg ? originImg : preview}
                alt="User-Profile"
                className="w-full h-full object-cover rounded-full"
              />
              <label
                htmlFor="userImg"
                className="flex bg-primary w-8 h-8 justify-center items-center rounded-full absolute bottom-0 right-0 cursor-pointer border-[3px] border-white box-content"
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
        </div>
        <div className="px-3">
          <div>
            <Typography.Title className="!text-xs !font-semibold !text-slate-700 !mb-1 !ml-1">
              닉네임
            </Typography.Title>
            <Input
              placeholder="닉네임을 입력해 주세요."
              className="rounded-lg text-base text-slate-700 px-3 py-[14px]"
              allowClear={{
                clearIcon: (
                  <IoCloseCircleSharp className="text-xl text-slate-300 duration-300 hover:text-slate-600" />
                ),
              }}
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full text-lg font-semibold py-3 text-white rounded-lg !h-auto mt-5 border-0"
            onClick={corUserInfo}
            disabled={!newName}
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
