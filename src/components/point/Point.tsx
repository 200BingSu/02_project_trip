import { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";
import { AiOutlineScan } from "react-icons/ai";

interface PointProps {
  handleClose?: () => void;
}
const Point = ({ handleClose }: PointProps): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [qrResult, setQrResult] = useState<string | null>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const qrScanner = new QrScanner(
        videoRef.current,
        result => {
          console.log("QR 코드 인식:", result.data);
          setQrResult(result.data);
        },
        { returnDetailedScanResult: true },
      );

      setScanner(qrScanner);
      startCamera(); // 컴포넌트가 마운트될 때 카메라 자동 실행
    }
  }, []);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // 후면 카메라 사용
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        scanner?.start();
      }
    } catch (error) {
      console.error("카메라 접근 실패:", error);
      alert("카메라 사용 권한을 허용해주세요.");
    }
  };

  useEffect(() => {
    if (qrResult) {
      if (qrResult.startsWith("http://")) {
        window.location.href = qrResult; // 결제 페이지로 이동
      } else {
        alert("유효한 결제 QR 코드가 아닙니다.");
      }
    }
  }, [qrResult]);
  return (
    <div className="max-w-[768px] w-full h-screen fixed top-0 left-1/2 -translate-x-1/2 bg-white z-50">
      <TitleHeaderTs icon="close" title="포인트 결제" onClick={handleClose} />
      <div className="relative ">
        {!qrResult ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full "
            />
            <div className="absolute top-20 left-10 w-10 h-10 rounded-tl-xl border-t-4 border-l-4 border-primary"></div>
            <div className="absolute top-20 right-10 w-10 h-10 rounded-tr-xl border-t-4 border-r-4 border-primary"></div>
            <div className="absolute bottom-40 left-10 w-10 h-10 rounded-bl-xl border-b-4 border-l-4 border-primary"></div>
            <div className="absolute bottom-40 right-10 w-10 h-10 rounded-br-xl   border-b-4 border-r-4 border-primary"></div>
          </>
        ) : (
          <h3>📌 QR 코드 결과: {qrResult}</h3>
        )}
        <div className="flex flex-col justify-center items-center mt-6 gap-1">
          <AiOutlineScan className="text-2xl text-slate-400 mr-1" />
          <p className="text-slate-700 text-base">
            <b>QR코드</b>를 촬영해주세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default Point;
