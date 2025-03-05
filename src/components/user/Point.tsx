import TitleHeaderTs from "../layout/header/TitleHeaderTs";
interface PointProps {
  handleClose?: () => void;
}
const Point = ({ handleClose }: PointProps): JSX.Element => {
  return (
    <div className="max-w-[768px] w-full h-screen fixed top-0 left-1/2 -translate-x-1/2 bg-white z-50">
      <TitleHeaderTs icon="" onClick={handleClose} />
    </div>
  );
};

export default Point;
