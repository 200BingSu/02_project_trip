import { useNavigate } from "react-router-dom";
import TitleHeader from "../components/layout/header/TitleHeader";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-[768px] min-w-xs mx-auto relative h-screen ">
      {/* <TitleHeader onClick={() => navigate("/")} /> */}
      <section className="flex flex-col items-center justify-center gap-5 p-32">
        <div className="flex items-center gap-5">
          <div className="min-w-40 aspect-square">
            <img
              src="/images/not.png"
              alt="not"
              className="w-full h-full object-cover"
            />
          </div>
          {/* <div className="w-72">
          <img src="/images/logo_2.png" alt="not" />
        </div> */}
          <h1 className="text-4xl text-[rgb(192,192,192)] font-bold">
            <p>404</p> <p>NOTFOUND</p>
          </h1>
        </div>

        <button
          type="button"
          className="text-[rgb(148,148,148)] underline"
          onClick={() => navigate("/")}
        >
          홈으로 돌아가기
        </button>
      </section>
    </div>
  );
};
export default NotFound;
