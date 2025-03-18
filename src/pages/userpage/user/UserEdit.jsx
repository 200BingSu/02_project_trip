import { useRecoilState } from "recoil";
import { userAtom } from "../../../atoms/userAtom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TitleHeader from "../../../components/layout/header/TitleHeader";
import { ProfilePic } from "../../../constants/pic";
import { useNavigate } from "react-router-dom";
import { BiSolidCamera } from "react-icons/bi";
import { Button, DatePicker, Input, message, Typography } from "antd";
import { IoCloseCircleSharp } from "react-icons/io5";
import { getCookie } from "../../../utils/cookie";
import TitleHeaderTs from "../../../components/layout/header/TitleHeaderTs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const UserEdit = () => {
  const [useProfile, setUseProfile] = useState({
    name: "",
    tell: "",
    birth: "",
    profilePic: "",
  });
  useEffect(() => {
    console.log("useProfile", useProfile);
  }, [useProfile]);
  const [preview, setPreview] = useState("/images/user.png");
  // 처음에 보여주는 이미지로서 서버에서 이미지를 가져옮
  const [originImg, setOriginImg] = useState(null);

  const [file, setFile] = useState(null);
  const [newName, setNewName] = useState("");
  const [newTell, setNewTell] = useState("");
  const [newBirth, setNewBirth] = useState("");

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
      // console.log("유저 정보 조회", res.data);
      const resultData = res.data;
      if (resultData.code === "200 성공") {
        setUseProfile(resultData.data);
        setNewName(resultData.data.name);
        setNewTell(resultData.data.tell);
        setNewBirth(resultData.data.birth);
        setPreview(resultData.data.profilePic); // 새로운 이미지로 교체
        setOriginImg(
          `${ProfilePic}/${userLogin.userId}/${res.data.data.profilePic}`,
        ); // 처음에 화면에 보일때 API 호출 후 최초 오리지널 이미지를 경로로 담는다.
      }
    } catch (error) {
      console.log(error);
    }
  };

  const corUserInfo = async () => {
    if (
      !file &&
      newName === useProfile.name &&
      newTell === useProfile.tell &&
      newBirth === useProfile.birth
    ) {
      message.warning("수정된 내용이 없습니다.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("profilePic", file);
    // console.log("useProfile.email ", useProfile.email);
    // console.log("newName ", newName);

    const requestData = {
      // email: useProfile.email,
      name: newName,
      tell: newTell,
      birth: newBirth,
    };
    console.log("requestData ", requestData);
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
    // console.log("Updated preview:", preview);
  }, [preview]);

  useEffect(() => {
    getUserInfo();
  }, []);

  // console.log("originImg", originImg);

  return (
    <>
      <TitleHeaderTs
        title="프로필 설정"
        icon="back"
        onClick={() => navigate(-1)}
      />
      <section className="flex flex-col gap-5 mt-5 py-3">
        {/* 유저 이미지 */}
        <div>
          <div>
            <div className="mx-auto w-32 aspect-square relative">
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
        {/* 폼 */}
        <div className="px-3">
          <ul className="flex flex-col gap-5 pb-5 border-b border-slate-200">
            <li>
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
            </li>
          </ul>
          <p className="text-sm text-slate-500 pt-5">
            * 서비스 이용을 위한 선택 입력 사항입니다.
          </p>
          <ul className="flex flex-col gap-5 py-3">
            <li>
              <Typography.Title className="!text-xs !font-semibold !text-slate-700 !mb-1 !ml-1">
                전화번호
              </Typography.Title>
              <Input
                placeholder="전화번호를 입력해 주세요."
                className="rounded-lg text-base text-slate-700 px-3 py-[14px]"
                allowClear={{
                  clearIcon: (
                    <IoCloseCircleSharp className="text-xl text-slate-300 duration-300 hover:text-slate-600" />
                  ),
                }}
                value={newTell}
                onChange={e => setNewTell(e.target.value)}
              />
            </li>
            <li>
              <Typography.Title className="!text-xs !font-semibold !text-slate-700 !mb-1 !ml-1">
                생일
              </Typography.Title>
              <DatePicker
                placeholder="생년월일을 입력해 주세요."
                className="w-full rounded-lg text-base text-slate-700 px-3 py-[14px]"
                value={newBirth ? dayjs(newBirth, "YYYY-MM-DD") : null}
                onChange={(date, dateString) => setNewBirth(dateString)}
              />
            </li>
          </ul>

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
      </section>
    </>
  );
};

export default UserEdit;
