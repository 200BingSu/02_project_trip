import Header from "./header/Header";
import MainHeader from "./header/MainHeader";

const Layout = () => {
  const path = window.location.pathname;
  return (
    <>
      {path === "/" ? <MainHeader /> : <Header />}
      {children}
      <Footer />
    </>
  );
};
export default Layout;
