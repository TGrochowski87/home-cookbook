import { Outlet } from "react-router-dom";
import PageSwitch from "./PageSwitch";
import "./styles.less";
import ThemeSwitch from "./ThemeSwitch";

const MainPageLayout = () => {
  return (
    <div className="page main-page">
      <ThemeSwitch />
      <PageSwitch />
      <Outlet />
    </div>
  );
};

export default MainPageLayout;
