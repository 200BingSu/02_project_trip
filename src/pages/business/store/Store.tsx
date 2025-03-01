import { Outlet } from "react-router-dom";

const Store = (): JSX.Element => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Store;
