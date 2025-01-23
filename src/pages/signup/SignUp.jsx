import { Outlet } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="w-full px-28">
      <h1>SignUp</h1>
      {<Outlet />}
    </div>
  );
};
export default SignUp;
