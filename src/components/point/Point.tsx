import { useRef, useState, useEffect } from "react";
import QrScanner from "qr-scanner";
import TitleHeaderTs from "../layout/header/TitleHeaderTs";

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
          stopCamera(); // 스캔 후 카메라 종료
        },
        { returnDetailedScanResult: true },
      );

      setScanner(qrScanner);
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

  // 카메라 종료
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      scanner?.stop();
    }
  };

  useEffect(() => {
    if (qrResult) {
      if (qrResult.startsWith("https://")) {
        window.location.href = qrResult; // 결제 페이지로 이동
      } else {
        alert("유효한 결제 QR 코드가 아닙니다.");
      }
    }
  }, [qrResult]);
  return (
    <div className="max-w-[768px] w-full h-screen fixed top-0 left-1/2 -translate-x-1/2 bg-white z-50">
      <TitleHeaderTs icon="" onClick={handleClose} />
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h2>QR 코드 스캔</h2>
        {!qrResult ? (
          <>
            <button
              onClick={startCamera}
              style={{ padding: "10px 20px", fontSize: "16px" }}
            >
              📷 카메라 열기
            </button>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", maxWidth: "500px", marginTop: "10px" }}
            />
            <button
              onClick={stopCamera}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                fontSize: "16px",
              }}
            >
              ❌ 카메라 종료
            </button>
          </>
        ) : (
          <h3>📌 QR 코드 결과: {qrResult}</h3>
        )}
      </div>
    </div>
  );
};

export default Point;
