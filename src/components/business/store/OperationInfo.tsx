import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ReactNode, useState } from "react";
// import { matchRestDataToKor } from "../../../utils/match";
import { Button, Input, message, Spin } from "antd";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CategoryType } from "../../../types/enum";
import { getCookie, setCookie } from "../../../utils/cookie";
import CenterModalTs from "../../common/CenterModalTs";
import ListItem from "./ListItem";
dayjs.extend(customParseFormat);

interface OperationInfoProps {
  children?: ReactNode;
}

const OperationInfo = ({}: OperationInfoProps): JSX.Element => {
  const navigate = useNavigate();
  // 쿠키
  const userInfo = getCookie("user");
  const userEmail = userInfo.email;
  const accessToken = getCookie("accessToken");
  // 쿼리
  const [searchParams] = useSearchParams();
  const strfId = searchParams.get("strfId");
  const category = searchParams.get("category");

  const [isDelete, setIsDelete] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 상품 삭제
  const deleteStrf = async () => {
    const url = "/api/detail/strf";
    setIsLoading(true);
    try {
      const res = await axios.delete(`${url}?strf_id=${strfId}`, {
        data: { strf_id: strfId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("상품 삭제 성공", res);
      const resultData = res.data;
      if (resultData) {
        message.success("업체가 삭제되었습니다.");
        setCookie("user", {
          ...userInfo,
          strfDtos: [{ strfId: null, title: null, category: null }],
        });
        navigate("/business");
      }
    } catch (error) {
      console.log("상품 삭제 실패", error);
      message.error("통신 오류로 인해 업체 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const matchCheck = (category: string) => {
    if (category === CategoryType.STAY) {
      return "입실/퇴실 시간";
    }
    if (category === CategoryType.RESTAURANT) {
      return "영업 시간";
    }
    if (category === CategoryType.TOUR || CategoryType.FEST) {
      return "개장 시간";
    }
  };
  return (
    <>
      {category === CategoryType.FEST && (
        <ListItem title="축제 기간" type="duration" />
      )}
      <ListItem title="업체 상태" type="state" />
      <ListItem title={matchCheck(category as string)} type="checkTime" />
      <ListItem title="휴무일" type="restDate" />
      {/* <ListItem title="임시 휴무일 등록" type="tempRest" /> */}
      {/* <section className="flex flex-col gap-2 px-6 py-5 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-slate-700">업체 삭제</h3>
          <p className="text-sm text-secondary3 font-normal">
            업체를 삭제하면 업체 정보를 복구할 수 없습니다.
          </p>
        </div>
        <Spin spinning={isLoading}>
          <div className="flex gap-2 items-start w-full">
            <div className="flex flex-col gap-1 w-full">
              <Input
                placeholder="현재 이메일을 입력해주세요."
                size="large"
                status={error ? "error" : undefined}
                onChange={e => {
                  setEmail(e.target.value);
                  if (e.target.value.trim() !== "") {
                    setError(false);
                  }
                }}
                value={email}
              />
              <p className="text-error text-sm">
                {error && "이메일이 일치하지 않습니다."}
              </p>
            </div>

            <Button
              type="dashed"
              size="large"
              className="w-fit"
              onClick={() => {
                if (userEmail !== email) {
                  setError(true);
                } else {
                  setIsDelete(true);
                }
              }}
            >
              삭제하기
            </Button>
          </div>
        </Spin>
      </section> */}
      {isDelete && (
        <CenterModalTs
          title="업체 삭제"
          content="정말 업체를 삭제하시겠습니까?"
          handleClickSubmit={() => {
            deleteStrf();
            setIsDelete(false);
          }}
          handleClickCancle={() => setIsDelete(false)}
        />
      )}
    </>
  );
};

export default OperationInfo;
