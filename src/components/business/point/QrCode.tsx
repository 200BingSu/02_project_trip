interface QrCodeProps {
  data: ArrayBuffer | null;
}

const QrCode = ({ data }: QrCodeProps) => {
  return (
    <div className="w-80 aspect-square bg-slate-200 rounded-lg">
      {base64String && (
        <img
          src={`data:image/png;base64,${base64String}`}
          alt="QR Code"
          className="w-full h-full object-contain"
        />
      )}
    </div>
  );
};

export default QrCode;
