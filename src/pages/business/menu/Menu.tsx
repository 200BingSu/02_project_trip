import { Outlet } from "react-router-dom";

const Menu = (): JSX.Element => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Menu;
